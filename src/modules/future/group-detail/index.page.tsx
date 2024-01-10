import FutureGroupDetail from '@/features/future/group/group-detail'
import { usePageContext } from '@/hooks/use-page-context'

export function Page() {
  const pageContext = usePageContext()

  return <FutureGroupDetail id={pageContext.routeParams.id} />
}
