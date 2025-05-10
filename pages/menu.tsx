import Layout from '../components/Layouts/Layouts'
import MenuList from '../components/Menu/MenuList'

export default function MenuPage() {
  return (
    <Layout title="Our Menu">
      <div className="container mt-5 pt-5">
        <h1 className="text-center mb-4">Our Menu</h1>
        <MenuList />
      </div>
    </Layout>
  )
}