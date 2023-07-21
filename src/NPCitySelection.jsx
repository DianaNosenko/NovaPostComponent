import React, { useEffect, useState, useRef} from 'react';
// import axios from 'axios';
import styles from './NPCitySelection.module.scss'
import { bodyCities } from './apiData';
import { getCitiesDataAction, setSelectedCity, setSelectedCityRef, getWarehousesDataAction, setSelectedWarehouse,} from './redux/actions/actionCreator';
import { connect } from 'react-redux';

const NPCitySelection = (props) => {
  const { getCitiesDataAction, setSelectedCity, setSelectedCityRef, getWarehousesDataAction, setSelectedWarehouse, } = props;
  const { citiesData, selectedCity, selectedCityRef, warehousesData, } = props;

    const [citiesInputValue, setCitiesInputValue] = useState('') //считывание ввода пользователя 
    const [cityOpen, setCityOpen] = useState(false) // открыть/закрыть окно с городами
    const [cityCurrentPage, setCityCurrentPage] = useState(1)
    const [cityFetching, setCityFetching] = useState(true)     
  
    // Получить массив городов
      useEffect(() => {
        const methodProperties = { Page: cityCurrentPage, Limit: 30 };
        const newBody = { ...bodyCities, methodProperties };
       
      if(cityFetching){
        getCitiesDataAction(newBody)
        setCityFetching(false);
      }
      }, [cityFetching]);
  
     // Установка выбранного города в инпут + получаем его реф
     const handleCityChange = (city) => {
      // console.log(city)
      // city !== '' ? setCitiesInputValue(''): void 0;
      setSelectedCityRef(city.Ref)
      setSelectedWarehouse(''); // Сброс выбранного отделения при изменении города
      getWarehousesDataAction([]) // сброс массива отделений
      setCityOpen(false);
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
        setClientHeight(visibleHeight)
      }
    };
  
    useEffect(() => {
      const scrollEndReached = scrollHeight - (scrollFromTop + clientHeight);
      if (scrollEndReached < 1 && scrollEndReached !== 0) {
        console.log('scroll');
        setCityFetching(true)
        setCityCurrentPage(prev => prev += 1)
      }
    }, [scrollHeight, scrollFromTop, clientHeight]);
  
    useEffect(() => {
      const scrollContainer = scrollContainerRef.current;
      if (scrollContainer) {
        scrollContainer.addEventListener('scroll', handleScroll);
      }
  
      return () => {
        if (scrollContainer) {
          scrollContainer.removeEventListener('scroll', handleScroll);
        }
      };
    }, []);
  
    return (
      <div className={styles.wrap}>
        <div className={styles.componentWrap}>
          <div className={styles.field}
          onClick={() => setCityOpen(!cityOpen)}>
            {selectedCity 
            ? selectedCity.length > 40
              ? `${selectedCity.slice(0, 40)}...`
              : selectedCity
            : 'Выберите город'}
            <span>▼</span>
          </div>
          <div className={styles.ul} ref={scrollContainerRef}
          style={{display: cityOpen ? 'block' : 'none'}}>
            <div className={styles.placeholder}>
              <span>🔎</span>
              <input 
                type='text' 
                value = {citiesInputValue}
                onClick = { () => setSelectedCity('')}
                onChange={(e) => setCitiesInputValue(e.target.value.toLowerCase())}
                placeholder='Введите название города' 
                className={styles.input}/>
            </div>
              <div id='citiesList' className={styles.list} >
              {citiesData.map((city) => (
                      <option 
                      key={city.Ref} value={city.Description}
                      className={`
                      ${styles.li} 
                      ${city.Description.toLowerCase() === selectedCity.toLowerCase()? styles.selectedElement : ''}`}
                      style={{display: new RegExp(citiesInputValue, 'i')
                      .test(city.Description) ? 'block' : 'none'
  
                    }}
                      onClick={()=> {
                        if (city.Description.toLowerCase() !== selectedCity.toLowerCase()) {
                          setSelectedCity(city.Description)
                        }
                        handleCityChange(city)
                      }}
                      >
                          {city.Description}
                      </option>
                  ))}
              </div>
          </div>
        </div>
      </div>
    );
  }

  const mapDispatchToProps = (dispatch) => ({
    getCitiesDataAction: (data) => dispatch(getCitiesDataAction(data)), 
    setSelectedCity: (data) => dispatch(setSelectedCity(data)), 
    setSelectedCityRef: (data) => dispatch(setSelectedCityRef(data)), 
    getWarehousesDataAction: (data) => dispatch(getWarehousesDataAction(data)), 
    setSelectedWarehouse: (data) => dispatch(setSelectedWarehouse(data)),
  })

  const mapStateToProps = (state) => {
    return {
      citiesData: state.novaPostReducers.citiesData,
      selectedCity: state.novaPostReducers.selectedCity,
      selectedCityRef: state.novaPostReducers.selectedCityRef,
      warehousesData: state.novaPostReducers.warehousesData,
    }
  }
  
export default connect(mapStateToProps, mapDispatchToProps)(NPCitySelection);
