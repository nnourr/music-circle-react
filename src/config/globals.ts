// env
export const SPOTIFY_CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
export const SPOTIFY_REDIRECT_URI = import.meta.env.VITE_SPOTIFY_REDIRECT_URI;
export const SERVER_ENDPOINT = import.meta.env.VITE_SERVER_ENDPOINT;

// colour
export const GRADIENT_START = (opacity = 1) => `rgb(41, 235, 38, ${opacity})`;
export const GRADIENT_MIDDLE = (opacity = 1) => `rgb(63, 177, 171, ${opacity})`;
export const GRADIENT_END = (opacity = 1) => `rgb(41, 195, 159, ${opacity})`;

export const RADIAL_GRADIENT = `radial-gradient(50% 50% at 50% 50%, ${GRADIENT_START()} 0%, ${GRADIENT_MIDDLE()} 70%, ${GRADIENT_END()} 100%)`;
export const RADIAL_GRADIENT_ALT = `radial-gradient(50% 50% at 50% 50%, ${GRADIENT_START()} 0%, ${GRADIENT_END()} 70%, ${GRADIENT_MIDDLE()} 100%)`;
export const RADIAL_GRADIENT_ERROR = `radial-gradient(50% 50% at 50% 50%, ${GRADIENT_START()} 0%, ${GRADIENT_MIDDLE()} 20%, ${GRADIENT_END()} 100%)`;
export const RADIAL_GRADIENT_WHITE = `radial-gradient(50% 50% at 50% 50%, rgb(255 255 255) 0%, rgb(255 255 255) 20%, rgb(255 255 255) 100%)`;
export const LINEAR_GRADIENT = `linear-gradient(215deg, ${GRADIENT_START()} 0%, ${GRADIENT_MIDDLE()} 55%, ${GRADIENT_END()} 100%)`;
export const LINEAR_GRADIENT_BREATHE_1 = `linear-gradient(275deg, ${GRADIENT_START()} 0%, ${GRADIENT_MIDDLE()} 40%, ${GRADIENT_END()} 100%)`;
export const LINEAR_GRADIENT_BREATHE_2 = `linear-gradient(275deg, ${GRADIENT_START()} 0%, ${GRADIENT_MIDDLE()} 80%, ${GRADIENT_END()} 100%)`;
export const LINEAR_GRADIENT_WHITE = `linear-gradient(215deg, #ffffff 0%, #ffffff 55%, #ffffff 100%)`;
export const SPOTIFY_GREEN = (opacity = 1) => `rgba(30, 215, 96, ${opacity})`;
