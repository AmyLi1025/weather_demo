export interface Forecast {
    cod: "200",
    message: 0,
    cnt: 40,
    list: ForecastDetail[],
    city: {
        id: 1814087,
        name: "Dalian",
        coord: {
            lat: 38.9122,
            lon: 121.6022
        },
        country: "CN",
        population: 1000000,
        timezone: 28800,
        sunrise: 1585776994,
        sunset: 1585822644
    }
}

export interface ForecastDetail {
    dt: number,
    main: {
        temp: number,
        feels_like: number,
        temp_min: number,
        temp_max: number,
        pressure: number,
        sea_level: number,
        grnd_level: number,
        humidity: number,
        temp_kf: number
    },
    weather: [
        {
            id: number,
            main: string,
            description: string,
            icon: string
        }
    ],
    clouds: {
        all: number
    },
    wind: {
        speed: number,
        deg: number
    },
    sys: {
        pod: string
    },
    dt_txt: string
}