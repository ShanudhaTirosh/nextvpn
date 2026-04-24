import React, { useState } from 'react';
import { Accordion } from 'react-bootstrap';
import { useCollection } from '../hooks/useFirestore';

const FAQ = () => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const { data: faqs } = useCollection('faq', []);

  // Fallback data
  const displayFaqs = faqs?.length > 0 ? faqs.sort((a,b) => a.order - b.order) : [
    { id: '1', question: 'What is V2Ray?', answer: 'V2Ray is a powerful proxy platform designed to bypass strict network censorship. It provides better speed, security, and evasion capabilities than traditional VPNs like OpenVPN.', category: 'Technical' },
    { id: '2', question: 'How long does payment activation take?', answer: 'We manually review all payments to ensure security. Activation typically takes between 10 minutes to 2 hours during normal business hours (8 AM - 10 PM).', category: 'Payments' },
    { id: '3', question: 'Can I use one account on multiple devices?', answer: 'Yes, depending on your plan. Starter allows 1 device, Pro allows 3, and Elite allows unlimited simultaneous connections.', category: 'Plans' },
    { id: '4', question: 'Do you keep logs?', answer: 'No. We have a strict zero-logs policy. We do not monitor, record, or store any data regarding your browsing activity.', category: 'General' },
    { id: '5', question: 'How do I setup the connection on my phone?', answer: 'For Android, download "v2rayNG" from the Play Store. For iOS, download "Shadowrocket" or "V2Box" from the App Store. Then simply copy your config from the portal and import it into the app.', category: 'Technical' }
  ];

  const categories = ['All', ...new Set(displayFaqs.map(f => f.category))];

  const filteredFaqs = displayFaqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(search.toLowerCase()) || 
                          faq.answer.toLowerCase().includes(search.toLowerCase());
    const matchesCat = category === 'All' || faq.category === category;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="faq-page section-bg-primary min-vh-100 pt-5">
      <div className="container-main section-padding">
        <div className="text-center reveal-on-scroll mb-5">
          <div className="section-eyebrow">Support Center</div>
          <h1 className="section-title text-white">Frequently Asked <span className="gradient-text">Questions</span></h1>
          
          <div className="mx-auto mt-4 position-relative" style={{ maxWidth: '600px' }}>
            <i className="fa-solid fa-search position-absolute text-muted" style={{ left: '20px', top: '15px' }}></i>
            <input 
              type="text" 
              className="form-input" 
              style={{ paddingLeft: '50px', height: '50px', borderRadius: '25px' }} 
              placeholder="Search for answers..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="d-flex justify-content-center flex-wrap gap-2 mb-4 reveal-on-scroll">
          {categories.map(c => (
            <button 
              key={c}
              className={category === c ? 'btn-gradient btn-sm' : 'btn-ghost btn-sm border-secondary text-secondary bg-dark'}
              onClick={() => setCategory(c)}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="mx-auto reveal-on-scroll" style={{ maxWidth: '800px' }}>
          {filteredFaqs.length > 0 ? (
            <Accordion className="faq-accordion">
              {filteredFaqs.map((faq, idx) => (
                <Accordion.Item eventKey={idx.toString()} key={faq.id}>
                  <Accordion.Header>{faq.question}</Accordion.Header>
                  <Accordion.Body>{faq.answer}</Accordion.Body>
                </Accordion.Item>
              ))}
            </Accordion>
          ) : (
            <div className="text-center text-muted py-5">
              <i className="fa-solid fa-ghost fs-1 mb-3"></i>
              <p>No answers found for your search.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FAQ;
