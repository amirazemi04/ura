import React from 'react';
import Valle from '../images/valleKombtare.png';

const ContactFormImg = () => {
  return (
    <section className="py-16" id="joinus">
      <div className="container mx-auto px-6">
        <div className="w-full h-40 sm:h-48 mb-8 sm:mb-12">
          <img
            src={Valle}
            alt="Ansambli URA"
            className="object-cover w-full h-full shadow-md"
          />
        </div>
      </div>
    </section>
  );
};

export default ContactFormImg;
