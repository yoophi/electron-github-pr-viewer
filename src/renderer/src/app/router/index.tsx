import { HomePage } from '@/pages/home'
import { MembersPage } from '@/pages/members'
import {
  PullRequestsAllPage,
  PullRequestsContainerPage,
  PullRequestsGroupByRepositoryPage
} from '@/pages/pull-requests'
import { RepositoriesPage } from '@/pages/repositories'
import { RootPage } from '@/pages/root'
import { SettingsPage } from '@/pages/settings'
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'

export function Root(): JSX.Element {
  return (
    <HashRouter basename="/">
      <Routes>
        <Route path="/" element={<RootPage />}>
          <Route index element={<Navigate to="home" replace />} />
          <Route path="home" element={<HomePage />} />
          <Route path="pull-requests" element={<PullRequestsContainerPage />}>
            <Route index element={<Navigate to="all" replace />} />
            <Route path="all" element={<PullRequestsAllPage />} />
            <Route path="group-by-repository" element={<PullRequestsGroupByRepositoryPage />} />
          </Route>
          <Route path="repositories" element={<RepositoriesPage />} />
          <Route path="members" element={<MembersPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}
