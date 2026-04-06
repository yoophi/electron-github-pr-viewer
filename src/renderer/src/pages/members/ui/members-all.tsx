import { useSettingStore } from '@/entities/settings'

export const MembersAllPage = () => {
  const { setting, error } = useSettingStore((state) => state)

  if (!setting) {
    return <div>loading...</div>
  }

  return (
    <>
      <div>MembersPage</div>
      {error && <pre>ERROR: {error}</pre>}
      <pre>{JSON.stringify(setting.members, null, 2)}</pre>
    </>
  )
}
