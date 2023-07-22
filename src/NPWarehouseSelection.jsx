import React, { useEffect, useState, useRef } from "react";
import styles from "./NPCitySelection.module.scss";
import { bodyWarehouses } from "./apiData";
import {
  getWarehousesDataAction,
  setSelectedWarehouse,
} from "./redux/actions/actionCreator";
import { connect } from "react-redux";

const NPWarehouseSelection = (props) => {
  const { getWarehousesDataAction, setSelectedWarehouse } = props;
  const { warehousesData, selectedWarehouse, selectedCity, selectedCityRef } = props;
  const {warehouseOpen, setWarehousesOpen} = props;

  const [warehousesInputValue, setWarehousesInputValue] = useState(""); //считывание ввода пользователя
  const [warehouseCurrentPage, setWarehouseCurrentPage] = useState(1);
  const [warehouseFetching, setWarehouseFetching] = useState(true);

  const methodProperties = {
    Page: warehouseCurrentPage,
    Limit: 30,
    CityRef: selectedCityRef,
  };
  const newBody = { ...bodyWarehouses, methodProperties };

  // смена данных отделений при смене города
  useEffect(() => {
    if (selectedCityRef.length) {
      getWarehousesDataAction({ data: newBody, newCity: true });
    }
  }, [selectedCityRef]);

  // пагинация + запрет на прогрузку отделений при загрузке страницы
  useEffect(() => {
    if (warehouseFetching && selectedCityRef.length) {
      getWarehousesDataAction({ data: newBody }); // пагинация
      setWarehouseFetching(false);
    }
  }, [warehouseFetching, selectedCityRef]);

  // Установка выбранного отделения в инпут
  const handleWarehouseChange = (warehouse) => {
    warehouse !== "" ? setWarehousesOpen(false) : void 0;
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
      console.log("scroll");
      setWarehouseFetching(true);
      setWarehouseCurrentPage((prev) => ++prev);
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
          disabled={!selectedCity}
          onClick={() =>
            warehousesData.length > 0
              ? setWarehousesOpen(!warehouseOpen)
              : void 0
          }
        >
          {warehousesData.length > 0
            ? selectedWarehouse
              ? selectedWarehouse.length > 40
                ? `${selectedWarehouse.slice(0, 40)}...`
                : selectedWarehouse
              : "Выберите отделение"
            : "Нет доступных отделений"}
          <span>▼</span>
        </div>
        <div
          className={styles.ul}
          ref={scrollContainerRef}
          style={{ display: warehouseOpen ? "block" : "none" }}
        >
          <div className={styles.placeholder}>
            <span>🔎</span>
            <input
              type="text"
              value={warehousesInputValue}
              onClick={() => setSelectedWarehouse("")}
              onChange={(e) =>
                setWarehousesInputValue(e.target.value.toLowerCase())
              }
              placeholder={
                warehousesData?.length > 0
                  ? "Введите название отделения"
                  : "Нет доступных отделений"
              }
              className={styles.input}
            />
          </div>
          <div className={styles.list}>
            {warehousesData.map((warehouse) => (
              <option
                key={warehouse.SiteKey}
                value={warehouse.Description}
                className={`
                      ${styles.li} 
                      ${
                        warehouse.Description.toLowerCase() ===
                        selectedWarehouse.toLowerCase()
                          ? styles.selectedElement
                          : ""
                      }`}
                style={{
                  display: new RegExp(warehousesInputValue, "i").test(
                    warehouse.Description
                  )
                    ? "block"
                    : "none",
                }}
                onClick={() => {
                  if (
                    warehouse.Description.toLowerCase() !==
                    selectedWarehouse.toLowerCase()
                  ) {
                    setSelectedWarehouse(warehouse.Description);
                  }
                  handleWarehouseChange(warehouse);
                }}
              >
                {warehouse.Description}
              </option>
            ))}
          </div>
        </div>
      </div>
  );
};

const mapDispatchToProps = (dispatch) => ({
  setSelectedWarehouse: (data) => dispatch(setSelectedWarehouse(data)),
  getWarehousesDataAction: (data) => dispatch(getWarehousesDataAction(data)),
});

const mapStateToProps = (state) => {
  return {
    selectedCity: state.novaPostReducers.selectedCity,
    selectedCityRef: state.novaPostReducers.selectedCityRef,
    warehousesData: state.novaPostReducers.warehousesData,
    selectedWarehouse: state.novaPostReducers.selectedWarehouse,
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NPWarehouseSelection);
