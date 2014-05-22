module.exports = {
    port: 8000,
    tasks: {
        load: {minute: 0}
    },
    // defaults to Jyväskylä
    sources: {
        mol: 'http://www.mol.fi/tyopaikat/tyopaikkatiedotus/haku/tyopaikat.rss?ilmoitettuPvm=1&hakusana=&vuokrapaikka=---&alueet=Jyv%C3%A4skyl%C3%A4%2C+&valitutAmmattialat=25&lang=fi',
        oikotie: 'http://tyopaikat.oikotie.fi/?toimiala[104]=104&sijainti[11]=11',
        vierityspalkki: 'http://vierityspalkki.fi/tyopaikat/', // TODO: allow location to be passed somehow
        eilakaisla: 'http://www.eilakaisla.fi/avoimet-tyopaikat?alue=13&haku=IT',
        duunitori: 'http://duunitori.fi/tyopaikat/?haku=it&alue=jyv%C3%A4skyl%C3%A4'
    }
};
