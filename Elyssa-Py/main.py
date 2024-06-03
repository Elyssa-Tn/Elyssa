import requests
import folium
from folium.features import GeoJsonTooltip
from branca.colormap import StepColormap, LinearColormap
import streamlit as st
import pandas as pd
import geopandas as geopandas
import matplotlib.pyplot as plt
from streamlit_folium import st_folium
from st_aggrid import AgGrid
from config import API, REQUEST, INIT_REQ, COLORS

st.set_page_config(layout="wide")
st.session_state.setdefault('center', [33.9989, 10.1658])
st.session_state.setdefault('zoom', 6)
st.session_state.setdefault('selected_opacity', 0.4)
st.session_state.setdefault('compare', False)
st.session_state.setdefault('target', None)
st.session_state.setdefault('tooltip_content', None)
st.session_state.setdefault('maps', [])
if 'selected_parti' not in st.session_state:
    st.session_state['selected_parti'] = None
if 'flag' not in st.session_state:
    st.session_state['flag'] = None


@st.cache_data
def get_init():
    response = requests.post(url=API, json=INIT_REQ)
    if response.status_code == 200:
        return response.json()['data']
    else:
        print('init request failed, status code: ', response.status_code)
        return response.text


@st.cache_data
def get_election(election):
    if (election):
        request = {
            "type": "election",
            "pays": "tunisie",
            "code_election": election['code_election']
        }
        response = requests.post(url=API, json=request)
        if response.status_code == 200:
            return response.json()['data']
        else:
            print('init request failed, status code: ', response.status_code)
            return response.text
    else:
        return None


@st.cache_resource
def get_df(mapObject) -> pd.DataFrame:
    response = requests.post(url=API, json=REQUEST)
    data = response.json()['map']['gouvernorat']

    gouvernorat = geopandas.GeoDataFrame.from_features(data, crs="EPSG:4326")
    gouvernorat["geometry"] = gouvernorat.geometry.simplify(0.001)

    if mapObject == None:
        return gouvernorat

    else:
        results = mapObject['result']['result'][0]['variables'][0]['resultat']
        results = [entry for entry in results if entry.get('code_unite') != ""]
        results_df = pd.DataFrame(results)
        results_df['code_unite'] = results_df['code_unite'].astype('int64')

        merged_gdf = gouvernorat.merge(
            results_df, how="left", left_on="code_gouvernorat", right_on="code_unite")
        return merged_gdf


def calculate_average(df):
    df['average'] = df['prc'].mean()
    return df


def calculate_percentage_difference(df, average_prc):
    df['percentile_diff'] = ((df['prc'] - average_prc) / average_prc) * 100
    df['average'] = average_prc
    return df


def colormap(df, target):
    min_value = df.min()
    max_value = df.max()

    if (st.session_state.compare and target):
        prc = df[21]
        diff_min = min_value - prc
        diff_max = max_value - prc
        return LinearColormap(
            vmin=diff_min,
            vmax=diff_max,
            colors=["red", "orange", "lightblue", "green", "darkgreen"],
            caption="Difference par rapport a la cible"
        )
    else:
        return StepColormap(colors=COLORS, index=None, vmin=min_value, vmax=max_value, caption="Moyenne generale")


def percentile_colormap(df):
    min_value = df['percentile_diff'].min()
    max_value = df['percentile_diff'].max()
    colormap = LinearColormap(
        colors=["red", "orange", "lightblue", "green", "darkgreen"],
        vmin=min_value,
        vmax=max_value,
        caption="Différence percentile de la moyenne"
    )
    return colormap


result = get_init()


def get_results(election, parti):
    if (election and parti):
        request = {
            "type": "data",
            "pays": "tunisie",
            "code_election": election['code_election'],
            "decoupage": "gouvernorat",
            "variables": [
                {"code_variable": "prc", "code_parti": parti['code_parti']}
            ]
        }
        response = requests.post(url=API, json=request)
        if response.status_code == 200:
            return response.json()['data']
        else:
            print('init request failed, status code: ', response.status_code)
            return response.text
    else:
        return None


def addMapToState(mapObject):
    length = len(st.session_state.maps)
    st.session_state.maps.append({length+1: mapObject})
    st.rerun()


def main():
    if not st.session_state['maps']:
        df = get_df(None)

        m = folium.Map(location=[33.9989, 10.1658], zoom_start=6)
        folium.GeoJson(df).add_to(m)

        st_folium(m, key='m', center=st.session_state["center"],
                  zoom=st.session_state["zoom"], width=525, height=550)
    else:
        for map_obj in st.session_state['maps']:
            key = list(map_obj.keys())[0]

            values = map_obj[key]

            df = get_df(values)
            colorMap = colormap(df["prc"], st.session_state.target)

            left, right = st.columns(2)
            with left:
                tooltip = GeoJsonTooltip(
                    fields=["nom_gouvernorat", "votes", "prc"],
                    aliases=[
                        "Gouvernorat:", "Nombres de votes:", "Pourcentage des votes:"],
                    localize=True,
                    sticky=False,
                    labels=True,
                    style="""
                            background-color: #F0EFEF;
                            border: 2px solid black;
                            border-radius: 3px;
                            box-shadow: 3px;
                        """,
                    max_width=800,

                )
                m = folium.Map(location=[33.9989, 10.1658], zoom_start=6)
                folium.GeoJson(df, style_function=lambda x: {
                    "fillColor": colorMap(x["properties"]["prc"])
                    if x["properties"]["prc"] is not None
                    else "transparent",
                    "color": "black",
                    "weight": '1',
                    "fillOpacity": st.session_state['selected_opacity'],
                },
                    tooltip=tooltip).add_to(m)
                colorMap.add_to(m)

                output = st_folium(m, key=key, center=st.session_state["center"],
                                   zoom=st.session_state["zoom"], width=525, height=550)
            with right:
                with st.container(border=2):
                    selection, sublevel = st.tabs(['Selection', 'Sousniveau'])
                    with selection:
                        col1, col2 = st.columns(2)
                        with col1:
                            st.write(output['last_object_clicked_tooltip'])
                        with col2:
                            st.write(st.session_state.target)

                    with sublevel:
                        edf = pd.DataFrame(
                            [
                                {"Delegation": "Delegation 1",
                                    "Voix": 4, "Pourcentage": 15},
                                {"Delegation": "Delegation 1",
                                    "Voix": 5, "Pourcentage": 20},
                                {"Delegation": "Delegation 1",
                                    "Voix": 3, "Pourcentage": 25},
                            ]
                        )
                        edited_df = st.data_editor(edf, key=key)
                    st.divider()
                    cleanedDF = df.drop(columns=['geometry'])
                    cleanedDF = cleanedDF.fillna(0)
                    columnDefs = [
                        {"headerName": "Nom gouvernorat",
                            "field": "nom_gouvernorat"},
                        {"headerName": "Votes", "field": "votes"},
                        {"headerName": "Voix", "field": "voix"},
                        {"headerName": "Pourcentage", "field": "prc"}]
                    AgGrid(cleanedDF, gridOptions={
                           "columnDefs": columnDefs}, height=332)
        st.markdown('---')
        st.header("Comparaison: Moyenne Nationale")
        left1, right1 = st.columns(2)
        average_prc = df['prc'].mean()
        with left1:
            df_with_avg = calculate_percentage_difference(df, average_prc)
            percent_colormap = percentile_colormap(df_with_avg)
            diff_map = folium.Map(location=[33.9989, 10.1658], zoom_start=6)
            folium.GeoJson(df_with_avg, style_function=lambda x: {
                "fillColor": percent_colormap(x["properties"]["percentile_diff"]),
                "color": "black",
                "weight": '1',
                "fillOpacity": st.session_state['selected_opacity'],
            }, tooltip=GeoJsonTooltip(
                fields=["nom_gouvernorat", "average",
                        "prc", "percentile_diff"],
                aliases=[
                    "Gouvernorat:", "Moyenne nationale:", "Pourcentage des votes:", "Différence percentile:"],
                localize=True,
                sticky=False,
                labels=True,
                style="""
                            background-color: #F0EFEF;
                            border: 2px solid black;
                            border-radius: 3px;
                            box-shadow: 3px;
                        """,
                max_width=800,
            )).add_to(diff_map)
            percent_colormap.add_to(diff_map)
            st_folium(diff_map, key='comparison_map', center=st.session_state["center"],
                      zoom=st.session_state["zoom"], width=525, height=550)
        with right1:
            with st.container(border=2):
                st.write(f"Moyenne nationale: {average_prc:.2f}%")
                above_average = df[df['prc'] > average_prc].shape[0]
                below_average = df[df['prc'] <= average_prc].shape[0]

                fig, ax = plt.subplots()
                ax.pie([above_average, below_average], labels=[
                       'Superieur', 'Inferieur'], autopct='%1.1f%%', colors=['green', 'red'])
                ax.set_title(
                    "Distribution des gouvernorats par rapport a la moyenne")
                st.pyplot(fig)


def sideBar():
    st.selectbox(
        key='selected_election',
        label="Choisissez une élection",
        placeholder='Liste des élections',
        index=None,
        options=result['elections'],
        format_func=lambda x: x['nom']
    )
    if st.session_state['selected_election']:
        st.selectbox(
            key='selected_parti',
            label="Choisissez un parti",
            placeholder="Liste des partis",
            index=None,
            options=get_election(st.session_state['selected_election'])[
                'partis'],
            format_func=lambda x: x['denomination_fr']
        )

    else:
        st.selectbox(
            label="Choisissez un parti",
            index=None,
            options=['A', 'B'],
            disabled=True,
            placeholder="Liste des partis"
        )
    if st.button("Ajoutez", disabled=not st.session_state['selected_parti']):
        results = get_results(
            st.session_state['selected_election'], st.session_state['selected_parti'])
        mapObject = {"election": st.session_state['selected_election'],
                     "parti": st.session_state['selected_parti'], "result": results}
        addMapToState(mapObject)
    st.markdown('---')
    st.slider('Opacité de la carte', 0.0, 1.0, 0.4, key="selected_opacity")


if __name__ == "__main__":
    main()
    with st.sidebar:
        sideBar()
