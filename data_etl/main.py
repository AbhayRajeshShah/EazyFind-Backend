import requests
from bs4 import BeautifulSoup
import pandas as pd
import re
from openpyxl import load_workbook
import os

output_file = "data.xlsx"


def scrape_eazydiner_listings(url: str, city: str, max_pages=200,mealType:str="dinner"):
    headers = {"User-Agent": "Mozilla/5.0"}
    all_data = []

    for page in range(1, max_pages + 1):
        page_url = f"{url}&page={page}"
        print(page_url)
        response = requests.get(page_url, headers=headers)
        response.raise_for_status()

        soup = BeautifulSoup(response.text, "html.parser")

        no_result = soup.select_one(".red")
        if no_result and "No restaurants found" in no_result.get_text():
            break

        parent = soup.find("div", class_="listing_restaurant_three_col__r6XnS")
        if not parent:
            break

        cards = parent.find_all("div", recursive=False)
        if not cards:
            break

        for card in cards:
            name_tag = card.select_one("h3 a")
            name = name_tag.text.strip() if name_tag else None
            restaurant_url = name_tag["href"] if name_tag else None

            meta = card.select(".listing_lh_18__xp_N9")
            area = meta[0].text.strip() if len(meta) > 0 else None
            cuisine = meta[1].text.strip() if len(meta) > 1 else None
            cost = meta[2].text.strip() if len(meta) > 2 else None

            offer_tag = card.select_one(".listing_res_deals__FOFVO .bold")
            offer = offer_tag.text.strip() if offer_tag else None

            rating = None
            for t in card.select("svg g text"):
                try:
                    rating = float(t.get_text(strip=True))
                    break
                except ValueError:
                    continue

            images = [
                img["src"] for img in card.find_all("img", alt="Restaurant Image")
                if img.get("src") and not img["src"].startswith("data:image")
            ]

            all_data.append({
                "city": city,
                "restaurant_name": name,
                "url": restaurant_url,
                "area": area,
                "cuisine": cuisine,
                "cost_for_two": cost,
                "offer": offer,
                "rating": rating,
                "images": ", ".join(images),
                "page": page,
                "meal_type": mealType
            })

    return pd.DataFrame(all_data)

mealtypes = ['breakfast','dinner','lunch']
cities = ['delhi-ncr', 'mumbai', 'bengaluru', 'chennai', 'pune','chandigarh-tricity']



for city in cities:
    print(f"\n📍 Processing city: {city}")
    city_url = f"https://www.eazydiner.com/restaurants?location={city}"

    for meal in mealtypes:
        location_url = city_url+f"&meal_period={meal}"

        try:
            restaurants_df = scrape_eazydiner_listings(
                location_url,
                city=city,
                mealType=meal
            )
            if restaurants_df is not None and not restaurants_df.empty:

                # File does not exist → create it
                if not os.path.exists(output_file):
                    restaurants_df.to_excel(
                        output_file,
                        index=False
                    )

                # File exists → append to it
                else:
                    with pd.ExcelWriter(
                        output_file,
                        engine="openpyxl",
                        mode="a",
                        if_sheet_exists="replace"
                    ) as writer:

                        existing_df = pd.read_excel(output_file)
                        combined_df = pd.concat([existing_df, restaurants_df], ignore_index=True)
                        combined_df.to_excel(writer, index=False)
                    print(f"✅ Appended {len(restaurants_df)} rows for {city} - {meal}")

        except Exception as e:
            print(f"❌ Error for {city} - {meal}: {e}")
