import React, { useEffect, useState, useRef } from "react";
import styles from "./NPCitySelection.module.scss";
import { bodyCities, bodySearchCity } from "./apiData";
import {
  getCitiesDataAction,
  setSelectedCity,
  setSelectedCityRef,
  setSelectedWarehouse,
} from "./redux/actions/actionCreator";
import { connect } from "react-redux";

const NPCitySelection = (props) => {
  const {
    getCitiesDataAction,
    setSelectedCity,
    setSelectedCityRef,
    setSelectedWarehouse,
  } = props;
  const {
    citiesData,
    selectedCity,
    setWarehousesOpen,
    prevCityIdRef,
    selectedCityRef,
  } = props;

  const [citiesInputValue, setCitiesInputValue] = useState(""); //считывание ввода пользователя
  const [cityOpen, setCityOpen] = useState(false); // открыть/закрыть окно с городами
  const [cityCurrentPage, setCityCurrentPage] = useState(1);
  const [cityFetching, setCityFetching] = useState(true);

  // Получить массив городов
  useEffect(() => {
    const methodProperties = { Page: cityCurrentPage, Limit: 30 };
    const newBody = { ...bodyCities, methodProperties };

    const methodPropertiesForSearch = {
      Page: 1,
      Limit: 30,
      CityName: citiesInputValue,
    };
    const newBodyForSearch = {
      ...bodySearchCity,
      methodProperties: methodPropertiesForSearch,
    };

    const methodPropertiesForClearData = { Page: 1, Limit: 30 };
    const newBodyForClearData = {
      ...bodyCities,
      methodProperties: methodPropertiesForClearData,
    };

    if (
      !citiesInputValue.length &&
      citiesInputValue !== prevCitiesInputValueRef.current
    ) {
      getCitiesDataAction({ data: newBodyForClearData, clearData: true });
      setCityFetching(false);
      prevCitiesInputValueRef.current = "";
      setCityCurrentPage(2);
    }
    if (cityFetching) {
      getCitiesDataAction({ data: newBody });
      setCityFetching(false);
    }
    if (citiesInputValue) {
      getCitiesDataAction({ data: newBodyForSearch });
      setCityFetching(false);
    }
  }, [cityFetching, citiesInputValue]);

  // Установка выбранного города в инпут + получаем его реф
  const handleCityChange = (city) => {
    setSelectedCityRef(city.Ref);
    setSelectedWarehouse(""); // Сброс выбранного отделения при изменении города
    setCityOpen(false);
  };
  const handleCityChangeForSearch = (city) => {
    setSelectedCityRef(city.DeliveryCity);
    setSelectedWarehouse(""); // Сброс выбранного отделения при изменении города
    setCityOpen(false);
  };

  // реф для получения доступа к предыдущему значению поля ввода
  const prevCitiesInputValueRef = useRef("");

  const inputOnChangeHandler = (e) => {
    prevCitiesInputValueRef.current = citiesInputValue;
    setCitiesInputValue(e.target.value);
  };

  /////////////////Логика пагинации///////////////////////////
  const scrollContainerRef = useRef(null);
  const [scrollHeight, setScrollHeight] = useState(0); // полная высота контейнера
  const [scrollFromTop, setScrollFromTop] = useState(0); // положение скрола от верха
  const [clientHeight, setClientHeight] = useState(0); // видимая высота контейнера

  const handleScroll = () => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      const fullHeight = scrollContainer.scrollHeight;
      const heightFromTop = scrollContainer.scrollTop;
      const visibleHeight = scrollContainer.clientHeight;

      setScrollHeight(fullHeight);
      setScrollFromTop(heightFromTop);
      setClientHeight(visibleHeight);
    }
  };

  useEffect(() => {
    const scrollEndReached = scrollHeight - (scrollFromTop + clientHeight);
    if (scrollEndReached < 1 && scrollEndReached !== 0) {
      setCityFetching(true);
      setCityCurrentPage((prev) => (prev += 1));
    }
  }, [scrollHeight, scrollFromTop, clientHeight]);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);
  return (
    <div className={styles.componentWrap}>
      <div
        className={styles.field}
        onClick={() => {
          setCityOpen(!cityOpen);
          setWarehousesOpen(false);
        }}
      >
        {selectedCity
          ? selectedCity.length > 40
            ? `${selectedCity.slice(0, 40)}...`
            : selectedCity
          : "Выберите город"}
        <span>▼</span>
      </div>
      <div
        className={styles.ul}
        ref={scrollContainerRef}
        style={{ display: cityOpen ? "block" : "none" }}
      >
        <div className={styles.placeholder}>
          <span>🔎</span>
          <input
            type="text"
            value={citiesInputValue}
            onClick={() => setSelectedCity("")}
            onChange={inputOnChangeHandler}
            placeholder="Введите название города"
            className={styles.input}
          />
        </div>
        {!citiesInputValue ? (
          <div id="citiesList" className={styles.list}>
            {citiesData.map((city) => (
              <option
                key={city.CityID}
                value={city.Description}
                className={`
                    ${styles.li} 
                    ${
                      city.Description === selectedCity
                        ? styles.selectedElement
                        : ""
                    }`}
                onClick={() => {
                  if (city.Description !== selectedCity) {
                    setSelectedCity(city.Description);
                  }
                  handleCityChange(city);
                }}
              >
                {city.Description}
              </option>
            ))}
          </div>
        ) : (
          <div id="citiesList" className={styles.list}>
            {citiesData.map((city) => (
              <option
                key={city.Ref}
                value={city.Present}
                className={`
                    ${styles.li} 
                    ${
                      city.Description === selectedCity
                        ? styles.selectedElement
                        : ""
                    }`}
                onClick={() => {
                  if (city.Present !== selectedCity) {
                    setSelectedCity(city.Present);
                  }
                  handleCityChangeForSearch(city);
                }}
              >
                {city.Present}
              </option>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const mapDispatchToProps = (dispatch) => ({
  getCitiesDataAction: (data) => dispatch(getCitiesDataAction(data)),
  setSelectedCity: (data) => dispatch(setSelectedCity(data)),
  setSelectedCityRef: (data) => dispatch(setSelectedCityRef(data)),
  setSelectedWarehouse: (data) => dispatch(setSelectedWarehouse(data)),
});

const mapStateToProps = (state) => {
  return {
    citiesData: state.novaPostReducers.citiesData,
    selectedCity: state.novaPostReducers.selectedCity,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(NPCitySelection);
