import React from 'react';
import Valle from '../images/valleKombtare.png';
import Reveal from './Reveal';

const ContactFormImg = () => {
  return (
    <section className="py-16" id="joinus">
      <div className="container mx-auto px-6">
        <Reveal>
          <div className="w-full h-40 sm:h-48 mb-8 sm:mb-12">
            <img
              src={Valle}
              alt="Ansambli URA"
              className="object-cover w-full h-full shadow-md"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default ContactFormImg;
