import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Star } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import fishChipsPlate from "@/assets/fish-chips-plate.jpg";
import prawnsImg from "@/assets/prawns.jpg";
import hamburgerDealImg from "@/assets/hamburger-deal.jpg";
import hawaiianBurgerImg from "@/assets/hawaiian-burger.jpg";
import specialForTwoImg from "@/assets/special-for-two.jpg";
import fishermanBasketImg from "@/assets/fisherman-basket.jpg";
import specialBasketImg from "@/assets/special-basket.jpg";
import chickenDealImg from "@/assets/chicken-deal.jpg";
import fishChipsSaladImg from "@/assets/fish-chips-salad.jpg";
import codFishImg from "@/assets/cod-fish.jpg";
import hokiFishImg from "@/assets/hoki-fish.jpg";
import snapperFishImg from "@/assets/snapper-fish.jpg";
import barramundiFishImg from "@/assets/barramundi-fish.jpg";
import hamburgerImg from "@/assets/hamburger.jpg";
import hamburgerLotImg from "@/assets/hamburger-lot.jpg";
import steakBurgerImg from "@/assets/steak-burger.jpg";
import steakBurgerLotImg from "@/assets/steak-burger-lot.jpg";
import baconEggBurgerImg from "@/assets/bacon-egg-burger.jpg";
import chickenBurgerImg from "@/assets/chicken-burger.jpg";
import fishBurgerImg from "@/assets/fish-burger.jpg";
import chickenSaladSandwichImg from "@/assets/chicken-salad-sandwich.jpg";
import chickenGravyRollImg from "@/assets/chicken-gravy-roll.jpg";
import chickenMayoRollImg from "@/assets/chicken-mayo-roll.jpg";
import steakGravyRollImg from "@/assets/steak-gravy-roll.jpg";
import hotDogImg from "@/assets/hot-dog.jpg";
import hotDogCheeseImg from "@/assets/hot-dog-cheese.jpg";
import hotDogLotImg from "@/assets/hot-dog-lot.jpg";
import kabanaDogImg from "@/assets/kabana-dog.jpg";
import kabanaDogLotImg from "@/assets/kabana-dog-lot.jpg";
import chickenNuggetsImg from "@/assets/chicken-nuggets.jpg";
import chickenChipsImg from "@/assets/chicken-chips.jpg";
import spicyChickenWingsImg from "@/assets/spicy-chicken-wings.jpg";
import chickenGarlicBallsImg from "@/assets/chicken-garlic-balls.jpg";
import fishCocktailsImg from "@/assets/fish-cocktails.jpg";
import prawnCutletsImg from "@/assets/prawn-cutlets.jpg";
import potatoScallopsImg from "@/assets/potato-scallops.jpg";
import calamariRingsImg from "@/assets/calamari-rings.jpg";
import seafoodBitesImg from "@/assets/seafood-bites.jpg";
import onionRingsImg from "@/assets/onion-rings.jpg";
import batteredMusselsImg from "@/assets/battered-mussels.jpg";
import kabanaImg from "@/assets/kabana.jpg";
import cheeseKabanaImg from "@/assets/cheese-kabana.jpg";
import chikoRollImg from "@/assets/chiko-roll.jpg";
import springRollImg from "@/assets/spring-roll.jpg";
import crumbedSausageImg from "@/assets/crumbed-sausage.jpg";
import baconCheeseSausageImg from "@/assets/bacon-cheese-sausage.jpg";
import batteredSavImg from "@/assets/battered-sav.jpg";
import fishCakeImg from "@/assets/fish-cake.jpg";
import chickenCheeseSchnitzelImg from "@/assets/chicken-cheese-schnitzel.jpg";
import miniDimSimImg from "@/assets/mini-dim-sim.jpg";
import chickenDimSimImg from "@/assets/chicken-dim-sim.jpg";
import cornJackImg from "@/assets/corn-jack.jpg";
import beefCroquetteImg from "@/assets/beef-croquette.jpg";
import seafoodStickImg from "@/assets/seafood-stick.jpg";
import pineappleFritterImg from "@/assets/pineapple-fritter.jpg";
import porkSausageImg from "@/assets/pork-sausage.jpg";
import hamCheeseScallopImg from "@/assets/ham-cheese-scallop.jpg";

interface MenuItem {
  name: string;
  description: string;
  price: string;
  popular?: boolean;
  image?: string;
}

interface MenuCategory {
  category: string;
  items: MenuItem[];
}

const Menu = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const menuCategories: MenuCategory[] = [
    {
      category: "Specials",
      items: [
        {
          name: "Hamburger Deal (w/ Lot + $12.00)",
          description: "4 burgers, $3 chips, 1.25L drink",
          price: "$37.00",
          popular: true,
          image: hamburgerDealImg,
        },
        {
          name: "Hawaiian Burger Deal",
          description: "4 Hawaiian burgers, $3 chips, 1.25L drink and medium gravy",
          price: "$40.00",
          popular: false,
          image: hawaiianBurgerImg,
        },
        {
          name: "Fish Deal",
          description: "4 cods, $3 chips, 1.25L drink",
          price: "$37.00",
          popular: true,
          image: fishChipsPlate,
        },
        {
          name: "Seafood Basket",
          description:
            "Minimum chips, 4 calamaries, 3 fish cocktails, 3 seafood bites, 2 prawn cutlets, 1 seafood stick, tartare sauce and lemon",
          price: "$16.00",
          popular: true,
          image: prawnsImg,
        },
        {
          name: "Special for Two",
          description: "$3 chips, 2 cods, 6 calamaries, 4 seafood bites and 3 potato scallops",
          price: "$29.50",
          popular: true,
          image: specialForTwoImg,
        },
        {
          name: "Fisherman Basket",
          description:
            "$3 chips, 2 cods, 10 fish cocktails, 10 calamari rings, 10 seafood bites, 8 prawn cutlets, 2 seafood sticks, 2 tartare sauce",
          price: "$62.00",
          popular: false,
          image: fishermanBasketImg,
        },
        {
          name: "Special Basket",
          description:
            "$3 chips, 2 cods, 10 fish cocktails, 8 calamari rings, 5 seafood bites, 5 prawn cutlets, 2 seafood sticks, 2 tartare sauce",
          price: "51.00",
          popular: false,
          image: specialBasketImg,
        },
        {
          name: "Chicken Deal",
          description: "1 whole chicken, $3 chips and 1.25L drink",
          price: "$27.00",
          popular: false,
          image: chickenDealImg,
        },
        {
          name: "Fish & Chips Salad Plate",
          description: "",
          price: "$15.00",
          popular: false,
          image: fishChipsSaladImg,
        },
      ],
    },
    {
      category: "Fish (Crumbed / Battered)",
      items: [
        { name: "Cod", description: "Add grilled +$1", price: "$7.50", popular: true, image: codFishImg },
        { name: "Hoki", description: "Add grilled +$1", price: "$8.00", image: hokiFishImg },
        { name: "Snapper", description: "Add grilled +$1", price: "$9.50", image: snapperFishImg },
        { name: "Barramundi", description: "Add grilled +$1", price: "$9.50", image: barramundiFishImg },
      ],
    },
    {
      category: "Snack Deals",
      items: [
        {
          name: "Chicken Nuggets",
          description: "5 for $3.80",
          price: "$3.80",
          popular: false,
          image: chickenNuggetsImg,
        },
        {
          name: "Chicken Chips",
          description: "5 for $3.50",
          price: "$3.50",
          popular: false,
          image: chickenChipsImg,
        },
        {
          name: "Spicy Chicken Wings",
          description: "5 for $8.50",
          price: "$8.50",
          popular: false,
          image: spicyChickenWingsImg,
        },
        {
          name: "Chicken Garlic Balls",
          description: "$1.70 each",
          price: "$1.70",
          popular: false,
          image: chickenGarlicBallsImg,
        },
        {
          name: "Fish Cocktails",
          description: "5 for $6.50",
          price: "$6.50",
          popular: true,
          image: fishCocktailsImg,
        },
        {
          name: "Prawn Cutlets",
          description: "5 for $8.00",
          price: "$8.00",
          popular: false,
          image: prawnCutletsImg,
        },
        {
          name: "Potato Scallops",
          description: "6 for $7.50",
          price: "$7.50",
          popular: true,
          image: potatoScallopsImg,
        },
        {
          name: "Calamari Rings",
          description: "8 for $7.00)",
          price: "$7.00",
          popular: true,
          image: calamariRingsImg,
        },
        {
          name: "Seafood Bites",
          description: "5 for $4.70",
          price: "$4.70",
          popular: false,
          image: seafoodBitesImg,
        },
        {
          name: "Onion Rings",
          description: "4 for $2.50",
          price: "$2.50",
          popular: false,
          image: onionRingsImg,
        },
        {
          name: "Battered Mussels",
          description: "4 for $3.50",
          price: "$3.50",
          popular: false,
          image: batteredMusselsImg,
        },
      ],
    },
    {
      category: "Burgers & Sandwiches",
      items: [
        { name: "Hamburger", description: "", price: "$7.50", popular: true, image: hamburgerImg },
        { name: "Hamburger w/ Lot", description: "", price: "$10.50", popular: true, image: hamburgerLotImg },
        { name: "Steak Burger", description: "", price: "$8.50", popular: true, image: steakBurgerImg },
        { name: "Steak Burger w/ Lot", description: "", price: "$11.50", popular: true, image: steakBurgerLotImg },
        { name: "Bacon & Egg Burger", description: "", price: "$7.50", image: baconEggBurgerImg },
        { name: "Chicken Burger", description: "", price: "$8.50", image: chickenBurgerImg },
        { name: "Fish Burger", description: "", price: "$9.50", image: fishBurgerImg },
        { name: "Chicken Salad Sandwich", description: "", price: "$7.00", image: chickenSaladSandwichImg },
      ],
    },
    {
      category: "Hot Rolls",
      items: [
        { name: "Chicken Gravy", description: "", price: "$7.00", image: chickenGravyRollImg },
        { name: "Chicken Mayo", description: "", price: "$7.00", image: chickenMayoRollImg },
        { name: "Steak Gravy", description: "", price: "$7.50", image: steakGravyRollImg },
        { name: "Hot Dog", description: "", price: "$5.00", image: hotDogImg },
        { name: "Hot Dog & Cheese", description: "", price: "$5.50", image: hotDogCheeseImg },
        { name: "Hot Dog w/ Lot", description: "", price: "$7.00", image: hotDogLotImg },
        { name: "Kabana Dog", description: "", price: "$6.00", image: kabanaDogImg },
        { name: "Kabana Dog w/ Lot", description: "", price: "$8.50", image: kabanaDogLotImg },
      ],
    },
    {
      category: "Snacks",
      items: [
        { name: "Kabana", description: "", price: "$3.80", image: kabanaImg },
        { name: "Cheese Kabana", description: "", price: "$3.80", image: cheeseKabanaImg },
        { name: "Chiko Roll", description: "", price: "$3.80", image: chikoRollImg },
        { name: "Spring Roll", description: "", price: "$3.80", image: springRollImg },
        { name: "Crumbed Sausage", description: "", price: "$3.50", image: crumbedSausageImg },
        { name: "Bacon & Cheese Crumbed Sausage", description: "", price: "$4.00", image: baconCheeseSausageImg },
        { name: "Battered Sav", description: "", price: "$3.50", image: batteredSavImg },
        { name: "Fish Cake", description: "", price: "$3.00", image: fishCakeImg },
        { name: "Chicken & Cheese Schnitzel", description: "", price: "$3.80", image: chickenCheeseSchnitzelImg },
        { name: "Mini Dim Sim", description: "", price: "$1.20", image: miniDimSimImg },
        { name: "Chicken Dim Sim", description: "", price: "$3.50", image: chickenDimSimImg },
        { name: "Corn Jack", description: "", price: "$3.50", image: cornJackImg },
        { name: "Beef Croquette", description: "", price: "$2.00", image: beefCroquetteImg },
        { name: "Seafood Stick", description: "", price: "$1.50", image: seafoodStickImg },
        { name: "Pineapple Fritter", description: "", price: "$1.80", image: pineappleFritterImg },
        { name: "Pork Sausage", description: "", price: "$4.50", image: porkSausageImg },
        { name: "Ham & Cheese Potato Scallop", description: "", price: "$4.00", image: hamCheeseScallopImg },
      ],
    },
    {
      category: "Chicken",
      items: [
        { name: "Whole", description: "", price: "$18.00" },
        { name: "Half", description: "", price: "$9.00" },
        { name: "Quarter", description: "", price: "$6.00" },
      ],
    },
    {
      category: "Minimum Hot Chips",
      items: [
        { name: "Chips", description: "", price: "$4.00" },
        { name: "Beer Battered Chips", description: "", price: "$4.00" },
        { name: "Potato Gems", description: "", price: "$4.00" },
      ],
    },
    {
      category: "Gravy",
      items: [
        { name: "Small", description: "", price: "$1.50" },
        { name: "Medium", description: "", price: "$2.50" },
        { name: "Large", description: "", price: "$3.50" },
      ],
    },
  ];

  // Filter categories based on search
  const filteredCategories = menuCategories
    .map((category) => ({
      ...category,
      items: category.items.filter(
        (item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    }))
    .filter((category) => category.items.length > 0);

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-3">Our Menu</h1>
          <p className="text-lg text-muted-foreground">Fresh fish and seafood, cooked to order daily</p>
        </div>

        {/* Search Bar */}
        <div className="max-w-md mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input
              type="text"
              placeholder="Search menu items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 text-base"
            />
          </div>
        </div>

        {/* Menu Categories */}
        <div className="space-y-12">
          {filteredCategories.map((category) => (
            <div key={category.category} className="space-y-4">
              {/* Category Header */}
              <h2 className="text-2xl md:text-3xl font-bold text-primary">{category.category}</h2>

              {/* Menu Items Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {category.items.map((item, index) => {
                  const isSnackCategory = category.category === "Snacks" || category.category === "Snack Deals";

                  return (
                    <Card
                      key={index}
                      className="overflow-hidden hover:shadow-md transition-all duration-200 hover:scale-[1.02]"
                    >
                      {/* Snack items with leading (left-side) image */}
                      {isSnackCategory && item.image ? (
                        <div className="p-4">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md">
                              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 min-w-0 flex justify-between items-start gap-3">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="text-base font-semibold break-words">{item.name}</h3>
                                  {item.popular && (
                                    <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                                      <Star className="h-3 w-3 fill-current" />
                                      Popular
                                    </Badge>
                                  )}
                                </div>
                                {item.description && (
                                  <p className="text-sm text-muted-foreground">{item.description}</p>
                                )}
                              </div>
                              <div className="text-lg font-bold text-primary whitespace-nowrap">{item.price}</div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        /* Regular items with top image */
                        <>
                          {item.image && (
                            <div className="relative h-32 w-full overflow-hidden">
                              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                              {item.popular && (
                                <Badge className="absolute top-2 right-2 bg-primary text-primary-foreground flex items-center gap-1 shadow-lg">
                                  <Star className="h-3 w-3 fill-current" />
                                  Popular
                                </Badge>
                              )}
                            </div>
                          )}
                          <div className="p-4">
                            <div className="flex justify-between items-start gap-3 mb-3">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="text-base font-semibold break-words">{item.name}</h3>
                                  {item.popular && !item.image && (
                                    <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                                      <Star className="h-3 w-3 fill-current" />
                                      Popular
                                    </Badge>
                                  )}
                                </div>
                                {item.description && (
                                  <p className="text-sm text-muted-foreground">{item.description}</p>
                                )}
                              </div>
                              <div className="text-lg font-bold text-primary whitespace-nowrap">{item.price}</div>
                            </div>
                          </div>
                        </>
                      )}
                    </Card>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer Note */}
        <div className="mt-12 text-center p-6 bg-secondary/50 rounded-lg">
          <p className="text-sm text-muted-foreground">
            * Prices subject to change. Please call to confirm current pricing.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Menu;
