'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { toast } from '@/shared/hooks/use-toast'
import { Button } from '@/shared/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/shared/ui/form'
import { Input } from '@/shared/ui/input'
import { Textarea } from '@/shared/ui/textarea'
import { useEffect, useState } from 'react'
import type { Setting } from './model'
import type { IPCResponse } from '@/shared/model'
import { Alert, AlertTitle, AlertDescription } from '@/shared/ui/alert'
import { AlertCircle } from 'lucide-react'

const FormSchema = z.object({
  accessToken: z.string().min(2, {
    message: 'access_token must be at least 2 characters.'
  }),
  repositories: z.string().min(2, {
    message: 'repositories must be at least 2 characters.'
  })
})

export function SettingsForm({ defaultValues }: { defaultValues: Setting }): JSX.Element {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues
  })

  async function onSubmit(data: z.infer<typeof FormSchema>): Promise<void> {
    try {
      const resp = (await window.api.writeSettings(data)) as IPCResponse<{ null }>
      toast({
        title: resp.message,
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <code className="text-white">{JSON.stringify(data, null, 2)}</code>
          </pre>
        )
      })
    } catch (err) {
      if (err instanceof Error) {
        toast({
          title: 'error',
          description: (
            <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
              <code className="text-white">{err.message}</code>
            </pre>
          )
        })
      } else {
        toast({
          title: 'Unknown Error',
          description: 'An unknown error occurred.'
        })
      }
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="accessToken"
          render={({ field }) => (
            <FormItem>
              <FormLabel>github access_token</FormLabel>
              <FormControl>
                <Input placeholder="***" {...field} />
              </FormControl>
              <FormDescription>
                github private <code>access_token</code> 을 넣어주세요.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="repositories"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="repositories">Repositories</FormLabel>
              <FormControl>
                <Textarea placeholder="조회할 repositories 를 입력해주세요." rows={20} {...field} />
              </FormControl>
              <FormDescription>공백이나 new line 으로 구분해주세요.</FormDescription>
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}

export const SettingsPage = () => {
  const [settings, setSettings] = useState<Setting | null>()
  const [errorMessage, setErrorMessage] = useState<string>()

  useEffect(() => {
    ;(async () => {
      const result = (await window.api.getSettings()) as IPCResponse<{
        accessToken: string
        repositories: string[]
      }>
      if (result.error) {
        setErrorMessage(result.message)
      }

      setSettings({
        accessToken: result.data.accessToken,
        repositories: result.data.repositories.join('\n')
      })
    })()
  }, [])

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Settings</h1>
      {errorMessage && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}
      {settings && <SettingsForm defaultValues={settings} />}
    </div>
  )
}
