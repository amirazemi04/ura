
import pattern from '../assets/pattern.png';

const PatternStrip = () => {
  return (
    <div className="w-full overflow-hidden my-32" style={{ backgroundColor: '#212121' }}>
      <div
        className="animate-scroll bg-repeat-x h-[70px] w-[200%]"
        style={{
          backgroundImage: `url(${pattern})`,
          backgroundRepeat: 'repeat-x',
          backgroundSize: 'contain',
        }}
      />
    </div>
  );
};

export default PatternStrip;
