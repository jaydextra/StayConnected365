import { useState } from 'react'
import './FAQ.css'

function FAQ() {
  const [activeIndex, setActiveIndex] = useState(null)

  const faqData = [
    {
      question: "What is an eSIM?",
      answer: "An eSIM (embedded SIM) is a digital SIM that allows you to activate a cellular plan without using a physical SIM card. It's built directly into your device and can be quickly activated through our platform."
    },
    {
      question: "Which devices are compatible with eSIM?",
      answer: "Most recent smartphones support eSIM, including iPhone XS and newer, Google Pixel 3 and newer, and many recent Samsung models. You can check your device's compatibility in your phone settings or manufacturer's website."
    },
    {
      question: "How quickly can I activate my eSIM?",
      answer: "eSIM activation is instant! Once you purchase a plan, you'll receive a QR code via email. Simply scan the code with your device, and you'll be connected within minutes."
    },
    {
      question: "Can I use my regular SIM and eSIM simultaneously?",
      answer: "Yes! Most eSIM-compatible devices support Dual SIM functionality, allowing you to use both your physical SIM and eSIM at the same time. This is perfect for keeping your home number while using our data service abroad."
    },
    {
      question: "In which countries can I use StayConnected365?",
      answer: "Our eSIM service works in over 190 countries worldwide. You can check specific country coverage and rates on our Products page before purchasing."
    },
    {
      question: "What happens if I need more data?",
      answer: "You can easily purchase additional data through your account at any time. Your existing plan will be topped up instantly without needing to activate a new eSIM."
    },
    {
      question: "How do I get support if I have issues?",
      answer: "Our support team is available 24/7 via email at support@stayconnected365.com. We typically respond within 1 hour for urgent connectivity issues."
    },
    {
      question: "Can I transfer my eSIM to another device?",
      answer: "eSIMs are tied to specific devices for security reasons. If you need to switch devices, you'll need to activate a new eSIM. Contact our support team, and we'll help you transfer your remaining data balance."
    }
  ]

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index)
  }

  return (
    <div className="faq-page">
      <div className="content-wrapper">
        <h1>Frequently Asked Questions</h1>
        <p className="faq-intro">
          Find answers to common questions about our eSIM service. Can't find what you're looking for?{' '}
          <a href="mailto:support@stayconnected365.com">Contact our support team</a>.
        </p>

        <div className="faq-grid">
          {faqData.map((faq, index) => (
            <div 
              key={index} 
              className={`faq-item ${activeIndex === index ? 'active' : ''}`}
              onClick={() => toggleAccordion(index)}
            >
              <div className="faq-question">
                <h3>{faq.question}</h3>
                <span className="icon">
                  {activeIndex === index ? '−' : '+'}
                </span>
              </div>
              <div className="faq-answer">
                <p>{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default FAQ 