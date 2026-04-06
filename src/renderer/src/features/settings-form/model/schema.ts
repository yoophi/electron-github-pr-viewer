import { z } from 'zod'

export const settingsFormSchema = z.object({
  accessToken: z.string().min(2, {
    message: 'access_token must be at least 2 characters.'
  }),
  org: z.string().min(1, {
    message: 'organization must be at least 1 character.'
  }),
  repositories: z.string().min(2, {
    message: 'repositories must be at least 2 characters.'
  })
})

export type SettingsFormValues = z.infer<typeof settingsFormSchema>
