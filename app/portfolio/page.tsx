
import { getAllProjects } from "@/lib/markdown"
import PortfolioPage from "./portfolio-page"

export default async function Portfolio() {
  const projects = await getAllProjects()
  return <PortfolioPage projects={projects} />
}
