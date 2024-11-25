import { useEffect, useState } from 'react'
import { useSettingStore } from '../settings/model'

export const PullRequestsPage = () => {
  const [pulls, setPulls] = useState<any>()
  const { setting } = useSettingStore((state) => state)

  if (!setting) {
    return <>setting not found</>
  }

  useEffect(() => {
    window.api
      .getPullRequests({
        accessToken: setting.accessToken,
        repository: 'payhereinc/payhere-pos-pc'
      })
      .then(setPulls)
  }, [])

  return (
    <>
      <div>PullRequestsPage</div>
      <pre>{JSON.stringify(pulls, null, 2)}</pre>
    </>
  )
}
