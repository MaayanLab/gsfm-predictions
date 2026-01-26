import Link from "next/link";

export default function Linkouts(props: { title: React.ReactElement, links: { href: string, label: React.ReactElement, target?: string }[] }) {
  return (
    <div className="self-stretch bg-white p-8">
      <div className="prose prose-h3:text-primary prose-p:text-primary">
        <h3>{props.title}</h3>
      </div>
      <div className="grid grid-cols-2 gap-4 justify-items-stretch items-stretch place-items-stretch">
        {props.links.map((link, i) => (
          <Link key={i} href={link.href} target={link.target} className="border border-[#6992C8] rounded-sm bg-[#F9FAFE] p-3 flex flex-col justify-center">
            <div className="bg-[#DCEBFF] text-[#013CC6] rounded-full p-2 flex flex-row justify-between">
              <span>{link.label}</span>
              <img src="/resources/LinkOutIcon.svg" alt="" />
            </div>
          </Link>))}
      </div>
    </div>
  )
}
