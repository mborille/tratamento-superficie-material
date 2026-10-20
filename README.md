# Tratamento de Superfície por Material (tratamento-superficie-material)

Monta o passo a passo do tratamento de superfície da peça (face interna), do dente e da cimentação, a partir do material da restauração, do substrato do dente, do cimento e de a peça ter sido provada com saliva. Tem cronômetro nos passos com tempo, avisos do que evitar e uma tabela comparativa dos materiais.

## Arquivos

- `tratamento-superficie-material.html`: app de um arquivo só. Abra no navegador (computador ou celular). Nada é enviado a servidor.
- `nucleo/modelo.js`: tabela de materiais e a função que monta o protocolo, em JavaScript puro, a mesma do app.
- `nucleo/teste_modelo.js`: testes. Rode com `node teste_modelo.js` dentro da pasta `nucleo`.

## Materiais cobertos

Porcelana feldspática, vitrocerâmica reforçada por leucita, dissilicato de lítio, silicato de lítio reforçado com zircônia, cerâmica infiltrada por polímero, resina CAD/CAM e indireta, zircônia (Y-TZP).

## Lógica

1. Vitrocerâmicas e híbrida: ácido fluorídrico (HF) por tempo que depende do material e da concentração, lavagem, silano por 60 s.
2. Resina CAD/CAM: jateamento com óxido de alumínio de 50 µm a baixa pressão, depois silano.
3. Zircônia: jateamento leve e primer com MDP. Sem HF, sem silano isolado.
4. Dente: ácido fosfórico a 35 a 37% por 30 s no esmalte e 15 s na dentina, lavagem, adesivo.
5. Peça provada com saliva: passo extra de limpeza adequado à família do material.

## Limites (declarar em qualquer publicação)

- Os tempos e as pressões são valores usuais da literatura e de instruções de fabricantes comuns. Não foram validados em bancada por este projeto.
- A instrução de uso do produto em uso prevalece sobre o app. Ele não considera marca, lote, validade, umidade nem a espessura da peça.
- Ferramenta de estudo e consulta rápida. Não é recomendação de conduta para um caso específico.

## Apoio de leitura (confira antes de citar)

Tian et al., Dent Mater 2014 (cimentos resinosos e vitrocerâmicas); Blatz et al., J Dent Res 2018 (cimentação adesiva em cerâmicas de alta resistência); Özcan e Bernasconi, J Adhes Dent 2015 (adesão à zircônia).

## Licença

MIT. Veja `LICENSE`.

## Como citar

Veja `CITATION.cff`.

DOI: https://doi.org/10.6084/m9.figshare.34716696
