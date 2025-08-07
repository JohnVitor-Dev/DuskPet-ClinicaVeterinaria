import TopBar from "../components/TopBar.jsx";
import HomeSlideBanner from "../components/HomeSlideBanner.jsx";
import PetShopBanner from '../assets/images/banner.jpg';

export default function HomePage() {

    return (
        <div className="home-container">
            <TopBar />
            <div className="min-height-container">
                <section className="main-banner">
                    <HomeSlideBanner />
                </section>
                <section className="products">
                    <h2>Produtos em Destaque</h2>
                </section>
                <section className="contact" >
                    <img src={PetShopBanner} alt="Pet Shop Banner" className='banner' />
                </section>
            </div>
        </div>
    );
}