import Layout from '../components/Layouts/Layouts'

export default function ContactPage() {
  return (
    <Layout title="Contact Us">
      <div className="container mt-5 pt-5">
        <h1 className="text-center mb-4">Contact Us</h1>
        
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card">
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6">
                    <h3>Our Location</h3>
                    <p>Chukha, Phuntsholing Town, FC 56789</p>
                    <p><strong>Phone:</strong> 17990854</p>
                    <p><strong>Email:</strong> thuktentshering462@gmail.com</p>
                    
                    <h3 className="mt-4">Opening Hours</h3>
                    <p>Monday - Friday: 11:00 AM - 10:00 PM</p>
                    <p>Saturday - Sunday: 10:00 AM - 11:00 PM</p>
                  </div>
                  <div className="col-md-6">
                    <h3>Send Us a Message</h3>
                    <form>
                      <div className="mb-3">
                        <input type="text" className="form-control" placeholder="Your Name" />
                      </div>
                      <div className="mb-3">
                        <input type="email" className="form-control" placeholder="Your Email" />
                      </div>
                      <div className="mb-3">
                        <textarea className="form-control" rows={4} placeholder="Your Message"></textarea>
                      </div>
                      <button type="submit" className="btn btn-primary">Send Message</button>
                    </form>
                  </div>
                </div>

                <div className="mt-4">
                  <h3>Find Us on Map</h3>
                  <div className="ratio ratio-16x9">
                    <iframe 
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.755275963878!2d89.3883223150617!3d26.85178098315716!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39e2a7e5b5b5b5b5%3A0x5b5b5b5b5b5b5b5!2sPhuntsholing%2C%20Bhutan!5e0!3m2!1sen!2sus!4v1610000000000!5m2!1sen!2sus" 
                      allowFullScreen
                      loading="lazy"
                    ></iframe>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}