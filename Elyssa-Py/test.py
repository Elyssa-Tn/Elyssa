import json
import folium
import streamlit as st

from streamlit_folium import st_folium

st.session_state.setdefault('center', [33.9989, 10.1658])
st.session_state.setdefault('zoom', 6)


@st.cache_data
def load_geojson(level):
    with open(f"maps/{level}.json", 'r') as f:
        geojson_data = json.load(f)
    return geojson_data


@st.cache_data
def create_map():
    m = folium.Map(location=[33.9989, 10.1658], zoom_start=6)
    folium.GeoJson(load_geojson('gouvernorat')).add_to(m)
    return m


def main():
    m = create_map()
    st_folium(m, center=st.session_state["center"],
              zoom=st.session_state["zoom"], width=725)


if __name__ == "__main__":
    main()
