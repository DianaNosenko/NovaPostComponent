import React, { useEffect, useState, useRef} from 'react';
import axios from 'axios';
import styles from './Sandbox.module.scss'
import { url, bodyCities, bodySearchCity, bodyWarehouses } from './apiData';

const Sandbox = () => {
    const [citiesArray, setCitiesArray] = useState([]); // массив из городов для отображения в списке
    const [citiesInputValue, setCitiesInputValue] = useState('') //считывание ввода пользователя 
    const [selectedCity, setSelectedCity] = useState(''); // выбранный город кликом по списку
    const [cityData, setCityData] = useState([]) // массив объектов городов со всеми их данными 
    const [cityOpen, setCityOpen] = useState(false) // открыть/закрыть окно с городами
    const [cityCurrentPage, setCityCurrentPage] = useState(1)
    const [cityFetching, setCityFetching] = useState(true)     
  
    const [selectedWarehouse, setSelectedWarehouse] = useState('');
    const [selectedCityRef, setSelectedCityRef] = useState('') // реф текущего города
  
  
      // Получить массив городов
      useEffect(() => {
        const methodProperties = { Page: cityCurrentPage, Limit: 30 };
        const bodyWithNewPage = { ...bodyCities, methodProperties };
        const fetchData = async () => {
          try {
            const response = await axios.post(url, bodyWithNewPage);
            const data = response.data.data;
            // console.log('bodyCities',bodyCities)
            // console.log('bodyWithNewPage',bodyWithNewPage)
             console.log(data)
            if (data) {
              // console.log(data)
              const cityNames = data.map(city => city.Description);
              setCitiesArray([...citiesArray, ...cityNames])
              setCityData(data);
            }
           
          } catch (error) {
            console.log(error);
          }
        };
      if(cityFetching){
        fetchData();
        setCityFetching(false);
      }
      }, [cityFetching]);
  
     // Установка выбранного города в инпут + получаем его реф
     const handleCityChange = (city) => {
      city !== '' ? setCityOpen(false) : void 0;
      city !== '' ? setCitiesInputValue(''): void 0;
      const selectedRef = cityData.find((object) => 
          object.Description === city
          )?.Ref || '';
      setSelectedCityRef(selectedRef)
      setSelectedWarehouse(''); // Сброс выбранного отделения при изменении города
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
      if (scrollEndReached < 50 && scrollEndReached !== 0) {
        console.log('scroll');
        setCityFetching(true)
        setCityCurrentPage(prev => ++prev)
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
              ? selectedCity.substring(0, 40) + '...'
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
              {citiesArray.map((city) => (
                      <option 
                      key={city} value={city}
                      className={`
                      ${styles.li} 
                      ${city.toLowerCase() === selectedCity.toLowerCase()? styles.selectedElement : ''}`}
                      style={{display: new RegExp(citiesInputValue, 'i')
                      .test(city) ? 'block' : 'none'
  
                    }}
                      onClick={()=> {
                        if (city.toLowerCase() !== selectedCity.toLowerCase()) {
                          setSelectedCity(city)
                        }
                        handleCityChange(city)
                      }}
                      >
                          {city}
                      </option>
                  ))}
              </div>
          </div>
        </div>
      </div>
    );
  }
  
  export default Sandbox;