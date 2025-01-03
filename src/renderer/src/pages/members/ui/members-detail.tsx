import { useParams } from 'react-router-dom'

export const MembersDetailPage = () => {
  const { memberId } = useParams()
  return (
    <div>
      <div>MembersDetailPage</div>
      <div>{JSON.stringify({ memberId }, null, 2)}</div>
    </div>
  )
}
