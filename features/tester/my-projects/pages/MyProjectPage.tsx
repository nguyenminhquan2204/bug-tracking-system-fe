'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useMyProjectStore } from '../stores/useMyProjectStore'
import { useShallow } from 'zustand/shallow'
import { useEffect } from 'react'
import { ProjectInfoDrawer } from '../components/ProjectInfoDrawer'
import { useRouter } from 'next/navigation'
import { statusStyles } from '@/packages/helpers'

export default function MyProjectPage() {
  const router = useRouter()
  const { 
    getMyProjects, 
    projectList, 
    setIsOpenDrawerInfoProject, 
    isOpenDrawerInfoProject,
    setSelectedProject
  } = useMyProjectStore(useShallow((state) => ({
    getMyProjects: state.getMyProjects,
    projectList: state.projectList,
    setIsOpenDrawerInfoProject: state.setIsOpenDrawerInfoProject,
    isOpenDrawerInfoProject: state.isOpenDrawerInfoProject,
    setSelectedProject: state.setSelectedProject
  })))

  useEffect(() => {
    getMyProjects();
  }, [])

  return (
    <>
      <ProjectInfoDrawer 
        open={isOpenDrawerInfoProject}
        onOpenChange={setIsOpenDrawerInfoProject}
      />
      <div className="p-2">
        <h1 className="mb-6 text-2xl font-semibold">My Projects</h1>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projectList && projectList.length > 0 && projectList.map((project) => (
            <Card key={project.id} className="flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {project.name}
                  <Badge
                    variant="outline"
                    className={
                      statusStyles[project.status] ||
                      'border-gray-400 bg-gray-400/10 text-gray-600'
                    }
                  >
                    {project.status}
                  </Badge>
                </CardTitle>
                <CardDescription>{project.description}</CardDescription>
              </CardHeader>

              <CardContent className="flex-1" />

              <CardFooter className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => {
                  setIsOpenDrawerInfoProject(true);
                  setSelectedProject(project)
                }}>View</Button>
                <Button onClick={() => router.push(`/tester/my-projects/${project.id}`)}>Manage</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </>
  )
}
