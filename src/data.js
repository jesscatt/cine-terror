// Catálogo inicial: clássicos do terror em domínio público, hospedados no Internet Archive.
const IA = (id, file) => `https://archive.org/download/${id}/${encodeURIComponent(file)}`;
const IA_IMG = (id) => `https://archive.org/services/img/${id}`;

window.FILMES_INICIAIS = [
  {
    id: "nosferatu",
    titulo: "Nosferatu",
    ano: 1922,
    diretor: "F. W. Murnau",
    sinopse: "O corretor Hutter viaja até os Cárpatos para vender uma casa ao misterioso Conde Orlok — e acaba trazendo a peste e o vampiro para a sua cidade.",
    imagem: IA_IMG("Nosferatu_most_complete_version_93_mins."),
    video: IA("Nosferatu_most_complete_version_93_mins.", "Nosferatu_1922_Symphony_of_Horror_512kb.mp4"),
  },
  {
    id: "noite-mortos-vivos",
    titulo: "A Noite dos Mortos-Vivos",
    ano: 1968,
    diretor: "George A. Romero",
    sinopse: "Um grupo de desconhecidos se tranca em uma casa de fazenda enquanto mortos voltam à vida e cercam o lugar. O filme que inventou o zumbi moderno.",
    imagem: IA_IMG("night_of_the_living_dead_dvd"),
    video: IA("night_of_the_living_dead_dvd", "Night.mp4"),
  },
  {
    id: "casa-maus-espiritos",
    titulo: "A Casa dos Maus Espíritos",
    ano: 1959,
    diretor: "William Castle",
    sinopse: "Um milionário excêntrico oferece dez mil dólares a cinco convidados que conseguirem passar a noite inteira numa mansão assombrada.",
    imagem: IA_IMG("house_on_haunted_hill_ipod"),
    video: IA("house_on_haunted_hill_ipod", "house_on_haunted_hill.mp4"),
  },
  {
    id: "carnaval-das-almas",
    titulo: "Carnaval das Almas",
    ano: 1962,
    diretor: "Herk Harvey",
    sinopse: "Depois de sobreviver a um acidente, Mary passa a ser perseguida por uma figura pálida e sente-se atraída por um parque de diversões abandonado.",
    imagem: IA_IMG("CarnivalofSouls"),
    video: IA("CarnivalofSouls", "CarnivalOfSouls.mp4"),
  },
  {
    id: "gabinete-caligari",
    titulo: "O Gabinete do Dr. Caligari",
    ano: 1920,
    diretor: "Robert Wiene",
    sinopse: "Um hipnotizador de feira exibe um sonâmbulo capaz de prever o futuro — e uma série de assassinatos começa na pequena cidade.",
    imagem: IA_IMG("DasKabinettdesDoktorCaligariTheCabinetofDrCaligari"),
    video: IA("DasKabinettdesDoktorCaligariTheCabinetofDrCaligari", "The_Cabinet_of_Dr._Caligari_512kb.mp4"),
  },
  {
    id: "fantasma-opera",
    titulo: "O Fantasma da Ópera",
    ano: 1925,
    diretor: "Rupert Julian",
    sinopse: "Nos subterrâneos da Ópera de Paris vive um gênio desfigurado, obcecado por uma jovem cantora que ele quer transformar em estrela.",
    imagem: IA_IMG("ThePhantomoftheOpera"),
    video: IA("ThePhantomoftheOpera", "Phantom_of_the_Opera_512kb.mp4"),
  },
];
