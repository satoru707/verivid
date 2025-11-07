// Mock job queue service (replace with Bull/BullMQ + Redis in production)

export interface Job {
  id: string
  type: "pin-ipfs" | "transcode-video" | "generate-thumbnail" | "scan-duplicate"
  videoId: string
  data: Record<string, any>
  status: "pending" | "processing" | "completed" | "failed"
  createdAt: Date
  completedAt?: Date
}

const jobQueue: Map<string, Job> = new Map()

export class QueueService {
  static addJob(type: Job["type"], videoId: string, data: Record<string, any>): string {
    const jobId = `job-${Date.now()}-${Math.random()}`
    const job: Job = {
      id: jobId,
      type,
      videoId,
      data,
      status: "pending",
      createdAt: new Date(),
    }

    jobQueue.set(jobId, job)
    console.log(`[Queue] Added job: ${type} for video ${videoId}`)

    // Simulate processing
    setTimeout(() => {
      QueueService.processJob(jobId)
    }, 1000)

    return jobId
  }

  static getJob(jobId: string): Job | undefined {
    return jobQueue.get(jobId)
  }

  static processJob(jobId: string): void {
    const job = jobQueue.get(jobId)
    if (!job) return

    job.status = "processing"
    console.log(`[Queue] Processing job: ${job.type}`)

    // Simulate job completion
    setTimeout(() => {
      job.status = "completed"
      job.completedAt = new Date()
      console.log(`[Queue] Completed job: ${job.type}`)
    }, 2000)
  }

  static getAllJobs(videoId?: string): Job[] {
    const jobs = Array.from(jobQueue.values())
    return videoId ? jobs.filter((j) => j.videoId === videoId) : jobs
  }
}
