import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

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
import { useSettingStore, type Setting } from '@/entities/settings'
import type { IPCResponse } from '@/shared/model'
import { settingsFormSchema, type SettingsFormValues } from '../model/schema'

export function SettingsForm({ defaultValues }: { defaultValues: Setting }): JSX.Element {
  const { setSettings } = useSettingStore((state) => state)
  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues
  })

  async function onSubmit(data: SettingsFormValues): Promise<void> {
    try {
      const resp = (await window.api.writeSettings(data)) as IPCResponse<void>
      setSettings({
        accessToken: data.accessToken,
        org: data.org,
        repositories: data.repositories.split(/\s+/).filter(Boolean),
        members: []
      })
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
          name="org"
          render={({ field }) => (
            <FormItem>
              <FormLabel>GitHub Organization</FormLabel>
              <FormControl>
                <Input placeholder="payhereinc" {...field} />
              </FormControl>
              <FormDescription>GitHub 조직명을 입력해주세요.</FormDescription>
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
