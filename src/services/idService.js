class IdService {
    static getId(type) {
        let tCode = type || "X";
        return `${tCode}-${Math.floor(Math.random() * 1000000)}`;
    }
}

module.exports = IdService;