# Store
Estado global compartido (Pinia recomendado).

## Uso típico
- Autenticación (usuario actual, token)
- Preferencias (tema, idioma)
- Cache ligera (listas ya cargadas)

## Buenas prácticas
- Evitar sobrecargar el store con todo
- Derivar estados complejos con getters en vez de duplicar
- Acciones asíncronas llaman servicios y actualizan estado