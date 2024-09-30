import Nav from "@/components/Nav";

export default function WebDevTeam() {
  return (
    <main className="">
      <Nav />
      <h1 className="text-4xl font-bold text-center my-8">Web Dev Team</h1>
      <div className="w-full text">
        <p className="text-lg px-8">
          The MMC Digital Lab Web Dev Team develops websites and materials for
          the MMC Digital Lab and the MMC Scholars program. Student employees
          are trained in many coding frameworks, including JavaScript, HTML/CSS,
          Next.js, and React; additionally, student employees train and build
          sites within the content management system Drupal. Web Dev team
          members are encouraged to explore their interests and expand their
          skillsets by training in other development software such as Blender,
          Unity, and Python.
        </p>
        <div className="text-3xl font-bold text-center my-8">
          Check out our projects below!
        </div>
      </div>
    </main>
  );
}
