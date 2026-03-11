'use client';

import { useState } from 'react';
import { faqData } from '@/components/landing/faqData';

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="faq-section" id="faq">
      <div style={{ textAlign: 'center' }}>
        <div className="section-eyebrow" style={{ textAlign: 'center' }}>FAQ</div>
        <h2 className="section-title" style={{ textAlign: 'center' }}>Questions fréquentes</h2>
      </div>

      <div className="faq-list">
        {faqData.map((item, index) => (
          <div key={index} className={`faq-item ${openIndex === index ? 'open' : ''}`}>
            <div className="faq-q" onClick={() => toggle(index)}>
              {item.question}
              <span className="faq-chevron">?</span>
            </div>
            <div className="faq-a" style={{ display: openIndex === index ? 'block' : 'none' }}>
              {item.answer}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

