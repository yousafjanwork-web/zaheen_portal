import image from '@/assets/images/landingPageBanner.png';

export default function SubscriptionImage() {
  return (
    <div className="lg:w-1/2">
      <img src={image} className="rounded-2xl shadow-2xl" />
    </div>
  );
}