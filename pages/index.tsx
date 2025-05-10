import Layout from '../components/Layouts/Layouts'

export default function HomePage() {
  return (
    <Layout>
      <div className="container mt-5 pt-5">
        <div className="row">
          <div className="col-md-8 mx-auto text-center">
            <h1 className="display-4 mb-4">Welcome to Vander Restaurant</h1>
            <p className="lead">
              Experience the finest cuisine in town with our carefully crafted menu
            </p>
            <div className="mt-5">
              <a href="/menu" className="btn btn-primary btn-lg me-3">View Menu</a>
              <a href="/order" className="btn btn-outline-primary btn-lg">Order Now</a>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}