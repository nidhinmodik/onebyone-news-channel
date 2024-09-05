const mode = import.meta.env.VITE_MODE;
let base_url = '';

if (mode === 'production') {
    base_url = import.meta.env.VITE_PRODUCTION_API_URL;
 }
else {
    base_url = import.meta.env.VITE_LOCAL_API_URL;
}

export { base_url }
