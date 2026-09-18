#!/usr/bin/env python3
"""Import catalog products and public images from 产品数据库导入模板.xlsx"""

from __future__ import annotations

import json
import re
import shutil
import zipfile
from collections import defaultdict
from pathlib import Path
from xml.etree import ElementTree as ET

XLSX = Path("/Users/Zhuanz/Downloads/产品数据库导入模板.xlsx")
ROOT = Path("/Users/Zhuanz/家居产品网站")
PUBLIC = ROOT / "public" / "products"
DATA = ROOT / "src" / "data" / "products.js"
CATS = ROOT / "src" / "data" / "categories.js"

NS = {
    "x": "http://schemas.openxmlformats.org/spreadsheetml/2006/main",
    "xdr": "http://schemas.openxmlformats.org/drawingml/2006/spreadsheetDrawing",
    "r": "http://schemas.openxmlformats.org/officeDocument/2006/relationships",
}

BLOCKED = {"image17.png", "image24.png"}

NAME_EN = {
    "15面宽夹缝柜": "15cm Slim Cabinet",
    "25面宽夹缝柜": "25cm Slim Cabinet",
    "折叠收纳箱；精装": "Foldable Storage Box (Gift Pack)",
    "折叠收纳箱": "Foldable Storage Box",
    "翻盖收纳箱": "Flip-lid Storage Box",
    "圆形密封罐": "Round Canister",
    "方形密封罐": "Square Canister",
    "砧板": "Cutting Board",
}

CAT_EN = {
    "夹缝柜": "Slim Cabinets",
    "折叠收纳箱": "Foldable Boxes",
    "翻盖收纳箱": "Flip-lid Boxes",
    "密封罐": "Canisters",
    "厨房用品": "Kitchen",
}


def col_row(ref: str):
    m = re.match(r"([A-Z]+)(\d+)", ref)
    return m.group(1), int(m.group(2))


def parse_sheet(zf: zipfile.ZipFile, name: str):
    root = ET.fromstring(zf.read(name))
    rows = defaultdict(dict)
    for cell in root.findall(".//x:c", NS):
        ref = cell.get("r")
        if not ref:
            continue
        col, row = col_row(ref)
        value_el = cell.find("x:v", NS)
        rows[row][col] = value_el.text if value_el is not None and value_el.text is not None else ""
    return rows


def format_size(text: str) -> str:
    if not text:
        return ""
    return text.replace("*", " × ")


def split_colors(text: str):
    return [part.strip() for part in re.split(r"[、,，/]", text or "") if part.strip()]


def split_files(text: str):
    return [part.strip() for part in re.split(r"[;；,，]", text or "") if part.strip()]


def num_or_blank(text: str):
    if text is None or text == "":
        return ""
    try:
        value = float(text)
        if value.is_integer():
            return int(value)
        return value
    except ValueError:
        return text


def logical_name(sheet_name: str) -> str:
    """image1.jpeg -> image1.jpg, image18.png stays png."""
    lower = sheet_name.lower()
    if lower.endswith(".jpeg"):
        return sheet_name[:-5] + ".jpg"
    return sheet_name


def js_value(value):
    return json.dumps(value, ensure_ascii=False)


def main():
    with zipfile.ZipFile(XLSX) as zf:
        products_rows = parse_sheet(zf, "xl/worksheets/sheet1.xml")
        image_rows = parse_sheet(zf, "xl/worksheets/sheet2.xml")

        rels = ET.fromstring(zf.read("xl/drawings/_rels/drawing1.xml.rels"))
        id_to_media = {
            rel.get("Id"): rel.get("Target").split("/")[-1]
            for rel in rels
        }
        drawing = ET.fromstring(zf.read("xl/drawings/drawing1.xml"))
        row_to_media = {}
        for anchor in drawing:
            frm = anchor.find("xdr:from", NS)
            excel_row = int(frm.find("xdr:row", NS).text) + 1
            blip = anchor.find(".//{http://schemas.openxmlformats.org/drawingml/2006/main}blip")
            embed = blip.get("{http://schemas.openxmlformats.org/officeDocument/2006/relationships}embed")
            row_to_media[excel_row] = id_to_media[embed]

        allowed = {}
        extra_by_sku = defaultdict(list)
        for row in sorted(image_rows):
            if row < 5:
                continue
            cols = image_rows[row]
            logical = cols.get("C", "").strip()
            import_flag = cols.get("G", "").strip()
            sku_cell = cols.get("A", "").strip()
            if not logical:
                continue
            if logical.lower() in BLOCKED or import_flag != "是":
                continue
            media = row_to_media.get(row)
            if not media:
                continue
            dest_name = logical_name(logical)
            allowed[logical.lower()] = dest_name
            PUBLIC.mkdir(parents=True, exist_ok=True)
            dest = PUBLIC / dest_name
            with zf.open(f"xl/media/{media}") as src, open(dest, "wb") as out:
                shutil.copyfileobj(src, out)
            for sku in re.split(r"[;；,，]", sku_cell):
                sku = sku.strip()
                if sku:
                    extra_by_sku[sku].append(f"/products/{dest_name}")

        products = []
        for row in sorted(products_rows):
            if row < 5:
                continue
            cols = products_rows[row]
            sku = cols.get("C", "").strip()
            if not sku:
                continue
            display = cols.get("P", "").strip()
            price_raw = cols.get("M", "").strip()
            price_type = cols.get("N", "").strip()
            pending = display == "待确认" or price_type == "待确认" or price_raw == ""
            price = None if pending or price_raw == "" else float(price_raw)
            if price is not None and price.is_integer():
                price = int(price)

            dims = format_size(cols.get("G", "").strip())
            fold = ""
            if "折叠后" in dims:
                parts = re.split(r"[；;]", dims)
                main = parts[0].replace("折叠后：", "").strip(" ；;")
                fold_part = next((p for p in parts if "折叠后" in p), "")
                dims = re.sub(r"^(伸长|展开)[:：]", "", main).strip()
                fold = fold_part.replace("折叠后：", "").replace("折叠后:", "").strip()
            elif "压缩" in dims:
                # keep full expandable size string
                pass

            images = []
            for fname in split_files(cols.get("O", "")):
                dest_name = allowed.get(fname.lower())
                if dest_name:
                    path = f"/products/{dest_name}"
                    if path not in images:
                        images.append(path)
            for path in extra_by_sku.get(sku, []):
                if path not in images:
                    # promotional extras already allowed; keep product-row images first
                    pass
            # Attach extra allowed images that belong to this SKU but weren't listed
            listed = set(images)
            for path in extra_by_sku.get(sku, []):
                if path not in listed:
                    images.append(path)

            net = cols.get("J", "").strip()
            gross = cols.get("K", "").strip()
            packing = num_or_blank(cols.get("H", "").strip())
            hq40 = num_or_blank(cols.get("L", "").strip())
            name = cols.get("B", "").strip()
            style = cols.get("E", "").strip()
            spec_id = cols.get("D", "").strip() or sku
            category = cols.get("A", "").strip()

            products.append(
                {
                    "id": len(products) + 1,
                    "name": name,
                    "nameEn": NAME_EN.get(name, name),
                    "sku": sku,
                    "specId": spec_id,
                    "style": style,
                    "category": category,
                    "colors": split_colors(cols.get("F", "")),
                    "dimensions": dims,
                    "foldSize": fold,
                    "packingQuantity": packing,
                    "cartonSize": format_size(cols.get("I", "").strip()),
                    "netWeight": f"{net} g" if net else "",
                    "grossWeight": f"{gross} kg" if gross else "",
                    "unitNetWeight": "",
                    "cartonGrossWeight": "",
                    "hq40": hq40 if hq40 != "" else "",
                    "price": price,
                    "pricePending": pending,
                    "priceType": price_type or ("待确认" if pending else ""),
                    "currency": "RMB",
                    "images": images,
                    "isNew": False,
                    "status": "active",
                    "displayStatus": display or "是",
                    "updatedAt": "2026-09-19",
                    "description": "；".join([p for p in [style, dims] if p]),
                    "descriptionEn": NAME_EN.get(name, name),
                }
            )

    # remove old mock svgs
    PUBLIC.mkdir(parents=True, exist_ok=True)
    for old in PUBLIC.glob("*"):
        if old.suffix.lower() == ".svg":
            old.unlink()

    fields = [
        "id", "name", "nameEn", "sku", "specId", "style", "category", "colors",
        "dimensions", "foldSize", "packingQuantity", "cartonSize", "netWeight",
        "grossWeight", "unitNetWeight", "cartonGrossWeight", "hq40", "price",
        "pricePending", "priceType", "currency", "images", "isNew", "status",
        "displayStatus", "updatedAt", "description", "descriptionEn",
    ]

    lines = [
        "/**",
        " * Factory catalog imported from 产品数据库导入模板.xlsx",
        " * Sheets used: 产品资料, 图片对应表",
        " * Not imported: 内部价格",
        " * Prices are editable in /admin before public release.",
        " * DATA_VERSION bumps localStorage so previous mock data is replaced.",
        " */",
        "",
        'export const DATA_VERSION = "excel-2026-09-19"',
        "",
        "export const PRODUCTS = [",
    ]
    for product in products:
        lines.append("  {")
        for key in fields:
            lines.append(f"    {key}: {js_value(product[key])},")
        lines.append("  },")
    lines.append("]")
    lines.append("")
    lines.append("export const PRODUCT_FIELDS = [")
    for key in fields:
        lines.append(f"  {js_value(key)},")
    lines.append("]")
    lines.append("")
    DATA.write_text("\n".join(lines), encoding="utf-8")

    categories = ["all"] + list(dict.fromkeys(p["category"] for p in products))
    cat_lines = ["export const CATEGORIES = ["]
    for cat in categories:
        if cat == "all":
            cat_lines.append(
                '  { id: "all", name: "全部产品", nameEn: "All Products", icon: "LayoutGrid" },'
            )
        else:
            cat_lines.append(
                f'  {{ id: {js_value(cat)}, name: {js_value(cat)}, nameEn: {js_value(CAT_EN.get(cat, cat))}, icon: "Box" }},'
            )
    cat_lines.append("]")
    cat_lines.append("")
    CATS.write_text("\n".join(cat_lines), encoding="utf-8")

    print("products", len(products))
    print("images", sorted(p.name for p in PUBLIC.iterdir()))
    pending = [p["specId"] for p in products if p["pricePending"]]
    print("pending", pending)
    missing = [p["specId"] for p in products if not p["images"]]
    print("missing images", missing)


if __name__ == "__main__":
    main()
