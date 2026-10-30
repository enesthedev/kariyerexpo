import { program } from "@/lib/content"
import { RevealText } from "@/components/reveal"
import { ProgramList } from "@/components/sections/program-list"

function Program() {
  return (
    <section id="program" className="container-page pb-section">
      <RevealText
        text={program.headline}
        accent={program.headlineAccent}
        className="text-h2"
      />
      <ProgramList
        groups={program.groups}
        note={program.note}
        label={program.carouselLabel}
        listLabel={program.listLabel}
      />
    </section>
  )
}

export { Program }
