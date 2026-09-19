import { Link } from "react-router-dom"

export default function BrandLogo({
  to = "/",
  markOnly = false,
  className = "h-12",
  link = true,
}) {
  const image = (
    <img
      src={markOnly ? "/brand/muenhui-mark.png" : "/brand/muenhui-logo.png"}
      alt="MUENHUI"
      className={`w-auto bg-white object-contain object-left ${className}`}
    />
  )

  if (!link) return image
  return (
    <Link to={to} className="inline-flex items-center bg-white" aria-label="MUENHUI">
      {image}
    </Link>
  )
}
