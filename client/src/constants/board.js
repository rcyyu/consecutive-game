const board = [
    [
        { card: 'w', team: null, isSequence: false, image: 'W.png', row: 0, col: 0 },
        { card: 'ac', team: null, isSequence: false, image: 'AC.png', row: 0, col: 1 },
        { card: 'kc', team: null, isSequence: false, image: 'KCpng', row: 0, col: 2 },
        { card: 'qc', team: null, isSequence: false, image: 'QC.png', row: 0, col: 3 },
        { card: '10c', team: null, isSequence: false, image: '10C.png', row: 0, col: 4 },
        { card: '9c', team: null, isSequence: false, image: '9C.png', row: 0, col: 5 },
        { card: '8c', team: null, isSequence: false, image: '8C.png', row: 0, col: 6 },
        { card: '7c', team: null, isSequence: false, image: '7C.png', row: 0, col: 7 },
        { card: '6c', team: null, isSequence: false, image: '6C.png', row: 0, col: 8 },
        { card: 'w', team: null, isSequence: false, image: 'W.png', row: 0, col: 9 }
    ],
    [
        { card: 'ad', team: null, isSequence: false, image: 'AD.png', row: 1, col: 0 },
        { card: '7s', team: null, isSequence: false, image: '7S.png', row: 1, col: 1 },
        { card: '8s', team: null, isSequence: false, image: '8S.png', row: 1, col: 2 },
        { card: '9s', team: null, isSequence: false, image: '9S.png', row: 1, col: 3 },
        { card: '10s', team: null, isSequence: false, image: '10S.png', row: 1, col: 4 },
        { card: 'qs', team: null, isSequence: false, image: 'QS.png', row: 1, col: 5 },
        { card: 'ks', team: null, isSequence: false, image: 'KS.png', row: 1, col: 6 },
        { card: 'as', team: null, isSequence: false, image: 'AS.png', row: 1, col: 7 },
        { card: '5c', team: null, isSequence: false, image: '5C.png', row: 1, col: 8 },
        { card: '2s', team: null, isSequence: false, image: '2S.png', row: 1, col: 9 }
    ],
    [
        { card: 'kd', team: null, isSequence: false, image: 'KD.png', row: 2, col: 0 },
        { card: '6s', team: null, isSequence: false, image: '6S.png', row: 2, col: 1 },
        { card: '10c', team: null, isSequence: false, image: '10C.png', row: 2, col: 2 },
        { card: '9c', team: null, isSequence: false, image: '9C.png', row: 2, col: 3 },
        { card: '8c', team: null, isSequence: false, image: '8C.png', row: 2, col: 4 },
        { card: '7c', team: null, isSequence: false, image: '7C.png', row: 2, col: 5 },
        { card: '6c', team: null, isSequence: false, image: '6C.png', row: 2, col: 6 },
        { card: '2d', team: null, isSequence: false, image: '2D.png', row: 2, col: 7 },
        { card: '4c', team: null, isSequence: false, image: '4C.png', row: 2, col: 8 },
        { card: '3s', team: null, isSequence: false, image: '3C.png', row: 2, col: 9 },
    ],
    [
        { card: '5s', team: null, isSequence: false, image: '5S.png', row: 3, col: 0 },
        { card: 'qd', team: null, isSequence: false, image: 'QD.png', row: 3, col: 1 },
        { card: 'qc', team: null, isSequence: false, image: 'QC.png', row: 3, col: 2 },
        { card: '8h', team: null, isSequence: false, image: '8H.png', row: 3, col: 3 },
        { card: '7h', team: null, isSequence: false, image: '7H.png', row: 3, col: 4 },
        { card: '6h', team: null, isSequence: false, image: '6H.png', row: 3, col: 5 },
        { card: '5c', team: null, isSequence: false, image: '5C.png', row: 3, col: 6 },
        { card: '3d', team: null, isSequence: false, image: '3D.png', row: 3, col: 7 },
        { card: '3c', team: null, isSequence: false, image: '3C.png', row: 3, col: 8 },
        { card: '4s', team: null, isSequence: false, image: '4S.png', row: 3, col: 9 },
    ],
    [
        { card: '10d', team: null, isSequence: false, image: '10D.png', row: 4, col: 0 },
        { card: '4s', team: null, isSequence: false, image: '4S.png', row: 4, col: 1 },
        { card: 'kc', team: null, isSequence: false, image: 'KC.png', row: 4, col: 2 },
        { card: '9h', team: null, isSequence: false, image: '9H.png', row: 4, col: 3 },
        { card: '2h', team: null, isSequence: false, image: '2H.png', row: 4, col: 4 },
        { card: '5h', team: null, isSequence: false, image: '5H.png', row: 4, col: 5 },
        { card: '4c', team: null, isSequence: false, image: '4C.png', row: 4, col: 6 },
        { card: '4d', team: null, isSequence: false, image: '4D.png', row: 4, col: 7 },
        { card: '2c', team: null, isSequence: false, image: '2C.png', row: 4, col: 8 },
        { card: '5s', team: null, isSequence: false, image: '5S.png', row: 4, col: 9 }
    ],
    [
        { card: '9d', team: null, isSequence: false, image: '9D.png', row: 5, col: 0 },
        { card: '3s', team: null, isSequence: false, image: '3S.png', row: 5, col: 1 },
        { card: 'ac', team: null, isSequence: false, image: 'AC.png', row: 5, col: 2 },
        { card: '10h', team: null, isSequence: false, image: '10H.png', row: 5, col: 3 },
        { card: '3h', team: null, isSequence: false, image: '3H.png', row: 5, col: 4 },
        { card: '4h', team: null, isSequence: false, image: '4H.png', row: 5, col: 5 },
        { card: '3c', team: null, isSequence: false, image: '3C.png', row: 5, col: 6 },
        { card: '5d', team: null, isSequence: false, image: '3D.png', row: 5, col: 7 },
        { card: 'ah', team: null, isSequence: false, image: 'AH.png', row: 5, col: 8 },
        { card: '6s', team: null, isSequence: false, image: '6S.png', row: 5, col: 9 }
    ],
    [
        { card: '8d', team: null, isSequence: false, image: '8D.png', row: 6, col: 0 },
        { card: '2s', team: null, isSequence: false, image: '2S.png', row: 6, col: 1 },
        { card: 'ad', team: null, isSequence: false, image: 'AD.png', row: 6, col: 2 },
        { card: 'qh', team: null, isSequence: false, image: 'QH.png', row: 6, col: 3 },
        { card: 'kh', team: null, isSequence: false, image: 'KH.png', row: 6, col: 4 },
        { card: 'ah', team: null, isSequence: false, image: 'AH.png', row: 6, col: 5 },
        { card: '2c', team: null, isSequence: false, image: '2C.png', row: 6, col: 6 },
        { card: '6d', team: null, isSequence: false, image: '6D.png', row: 6, col: 7 },
        { card: 'kh', team: null, isSequence: false, image: 'KH.png', row: 6, col: 8 },
        { card: '7s', team: null, isSequence: false, image: '7S.png', row: 6, col: 9 }
    ],
    [
        { card: '7d', team: null, isSequence: false, image: '7D.png', row: 7, col: 0 },
        { card: '2h', team: null, isSequence: false, image: '2H.png', row: 7, col: 1 },
        { card: 'kd', team: null, isSequence: false, image: 'KD.png', row: 7, col: 2 },
        { card: 'qd', team: null, isSequence: false, image: 'QD.png', row: 7, col: 3 },
        { card: '10d', team: null, isSequence: false, image: '10D.png', row: 7, col: 4 },
        { card: '9d', team: null, isSequence: false, image: '9D.png', row: 7, col: 5 },
        { card: '8d', team: null, isSequence: false, image: '8D.png', row: 7, col: 6 },
        { card: '7d', team: null, isSequence: false, image: '7D.png', row: 7, col: 7 },
        { card: 'qh', team: null, isSequence: false, image: 'QH.png', row: 7, col: 8 },
        { card: '8s', team: null, isSequence: false, image: '8S.png', row: 7, col: 9 }
    ],
    [
        { card: '6d', team: null, isSequence: false, image: '6D.png', row: 8, col: 0 },
        { card: '3h', team: null, isSequence: false, image: '3H.png', row: 8, col: 1 },
        { card: '4h', team: null, isSequence: false, image: '4H.png', row: 8, col: 2 },
        { card: '5h', team: null, isSequence: false, image: '5H.png', row: 8, col: 3 },
        { card: '6h', team: null, isSequence: false, image: '6H.png', row: 8, col: 4 },
        { card: '7h', team: null, isSequence: false, image: '7H.png', row: 8, col: 5 },
        { card: '8h', team: null, isSequence: false, image: '8H.png', row: 8, col: 6 },
        { card: '9h', team: null, isSequence: false, image: '9H.png', row: 8, col: 7 },
        { card: '10h', team: null, isSequence: false, image: '10H.png', row: 8, col: 8 },
        { card: '9s', team: null, isSequence: false, image: '9S.png', row: 8, col: 9 }
    ],
    [
        { card: 'w', team: null, isSequence: false, image: 'W.png', row: 9, col: 0 },
        { card: '5d', team: null, isSequence: false, image: '5D.png', row: 9, col: 1 },
        { card: '4d', team: null, isSequence: false, image: '4D.png', row: 9, col: 2 },
        { card: '3d', team: null, isSequence: false, image: '3D.png', row: 9, col: 3 },
        { card: '2d', team: null, isSequence: false, image: '2D.png', row: 9, col: 4 },
        { card: 'as', team: null, isSequence: false, image: 'AS.png', row: 9, col: 5 },
        { card: 'ks', team: null, isSequence: false, image: 'KS.png', row: 9, col: 6 },
        { card: 'qs', team: null, isSequence: false, image: 'QS.png', row: 9, col: 7 },
        { card: '10s', team: null, isSequence: false, image: '10S.png', row: 9, col: 8 },
        { card: 'w', team: null, isSequence: false, image: 'W.png', row: 9, col: 9 }
    ]
];

module.exports = board;
