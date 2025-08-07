import PetShopBanner from '../assets/images/banner.jpg';

export default function HomeSlideBanner() {

    return (
        <div className="swiper-container">
            <img src={PetShopBanner} alt="Pet Shop Banner" className='banner' />
        </div>
    );
}
