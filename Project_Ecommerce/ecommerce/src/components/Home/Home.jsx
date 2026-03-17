import HomeHeader from "./HomeHeader";
import HomePrincipal from "./HomePrincipal";
import HomeDestacados from "./HomeDestacados";
import HomeFeatures from "./HomeFeatures";
import HomeFooter from "./HomeFooter";


export default function Home() {
  return (
    <div className="home">
      <HomeHeader />
      <HomePrincipal />
      <HomeDestacados />
      <HomeFeatures />
      <HomeFooter />
    </div>
  );
}