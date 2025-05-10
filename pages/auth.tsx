import { useRouter } from 'next/router'
import Layout from '../components/Layouts/Layouts'
import AuthForm from '../components/Auth/AuthForm'

export default function AuthPage() {
  const router = useRouter()
  const { mode } = router.query

  return (
    <Layout title={mode === 'login' ? 'Login' : 'Register'}>
      <AuthForm mode={mode === 'login' ? 'login' : 'register'} />
    </Layout>
  )
}