const board = [
    [
        { card: 'w', occupied: false, team: null, isSequence: false },
        { card: 'ac', occupied: false, team: null, isSequence: false },
        { card: 'kc', occupied: false, team: null, isSequence: false },
        { card: 'qc', occupied: false, team: null, isSequence: false },
        { card: '10c', occupied: false, team: null, isSequence: false },
        { card: '9c', occupied: false, team: null, isSequence: false },
        { card: '8c', occupied: false, team: null, isSequence: false },
        { card: '7c', occupied: false, team: null, isSequence: false },
        { card: '6c', occupied: false, team: null, isSequence: false },
        { card: 'w', occupied: false, team: null, isSequence: false }
    ],
    [
        { card: 'ad', occupied: false, team: null, isSequence: false },
        { card: '7s', occupied: false, team: null, isSequence: false },
        { card: '8s', occupied: false, team: null, isSequence: false },
        { card: '9s', occupied: false, team: null, isSequence: false },
        { card: '10s', occupied: false, team: null, isSequence: false },
        { card: 'qs', occupied: false, team: null, isSequence: false },
        { card: 'ks', occupied: false, team: null, isSequence: false },
        { card: 'as', occupied: false, team: null, isSequence: false },
        { card: '5c', occupied: false, team: null, isSequence: false },
        { card: '2s', occupied: false, team: null, isSequence: false }
    ],
    [
        { card: 'kd', occupied: false, team: null, isSequence: false },
        { card: '6s', occupied: false, team: null, isSequence: false },
        { card: '10c', occupied: false, team: null, isSequence: false },
        { card: '9c', occupied: false, team: null, isSequence: false },
        { card: '8c', occupied: false, team: null, isSequence: false },
        { card: '7c', occupied: false, team: null, isSequence: false },
        { card: '6c', occupied: false, team: null, isSequence: false },
        { card: '2d', occupied: false, team: null, isSequence: false },
        { card: '4c', occupied: false, team: null, isSequence: false },
        { card: '3s', occupied: false, team: null, isSequence: false },
    ],
    [
        { card: 'qd', occupied: false, team: null, isSequence: false },
        { card: '5s', occupied: false, team: null, isSequence: false },
        { card: 'qc', occupied: false, team: null, isSequence: false },
        { card: '8h', occupied: false, team: null, isSequence: false },
        { card: '7h', occupied: false, team: null, isSequence: false },
        { card: '6h', occupied: false, team: null, isSequence: false },
        { card: '5c', occupied: false, team: null, isSequence: false },
        { card: '3d', occupied: false, team: null, isSequence: false },
        { card: '3c', occupied: false, team: null, isSequence: false },
        { card: '4s', occupied: false, team: null, isSequence: false },
    ],
    [
        { card: '10d', occupied: false, team: null, isSequence: false },
        { card: '4s', occupied: false, team: null, isSequence: false },
        { card: 'kc', occupied: false, team: null, isSequence: false },
        { card: '9h', occupied: false, team: null, isSequence: false },
        { card: '2h', occupied: false, team: null, isSequence: false },
        { card: '5h', occupied: false, team: null, isSequence: false },
        { card: '4c', occupied: false, team: null, isSequence: false },
        { card: '4d', occupied: false, team: null, isSequence: false },
        { card: '2c', occupied: false, team: null, isSequence: false },
        { card: '5s', occupied: false, team: null, isSequence: false }
    ],
    [
        { card: '9d', occupied: false, team: null, isSequence: false },
        { card: '3s', occupied: false, team: null, isSequence: false },
        { card: 'ac', occupied: false, team: null, isSequence: false },
        { card: '10h', occupied: false, team: null, isSequence: false },
        { card: '3h', occupied: false, team: null, isSequence: false },
        { card: '4h', occupied: false, team: null, isSequence: false },
        { card: '3c', occupied: false, team: null, isSequence: false },
        { card: '5d', occupied: false, team: null, isSequence: false },
        { card: 'ah', occupied: false, team: null, isSequence: false },
        { card: '6s', occupied: false, team: null, isSequence: false }
    ],
    [
        { card: '8d', occupied: false, team: null, isSequence: false },
        { card: '2s', occupied: false, team: null, isSequence: false },
        { card: 'ad', occupied: false, team: null, isSequence: false },
        { card: 'qh', occupied: false, team: null, isSequence: false },
        { card: 'kh', occupied: false, team: null, isSequence: false },
        { card: 'ah', occupied: false, team: null, isSequence: false },
        { card: '2c', occupied: false, team: null, isSequence: false },
        { card: '6d', occupied: false, team: null, isSequence: false },
        { card: 'kh', occupied: false, team: null, isSequence: false },
        { card: '7s', occupied: false, team: null, isSequence: false }
    ],
    [
        { card: '7d', occupied: false, team: null, isSequence: false },
        { card: '2h', occupied: false, team: null, isSequence: false },
        { card: 'kd', occupied: false, team: null, isSequence: false },
        { card: 'qd', occupied: false, team: null, isSequence: false },
        { card: '10d', occupied: false, team: null, isSequence: false },
        { card: '9d', occupied: false, team: null, isSequence: false },
        { card: '8d', occupied: false, team: null, isSequence: false },
        { card: '7d', occupied: false, team: null, isSequence: false },
        { card: 'qh', occupied: false, team: null, isSequence: false },
        { card: '8s', occupied: false, team: null, isSequence: false }
    ],
    [
        { card: '6d', occupied: false, team: null, isSequence: false },
        { card: '3h', occupied: false, team: null, isSequence: false },
        { card: '4h', occupied: false, team: null, isSequence: false },
        { card: '5h', occupied: false, team: null, isSequence: false },
        { card: '6h', occupied: false, team: null, isSequence: false },
        { card: '7h', occupied: false, team: null, isSequence: false },
        { card: '8h', occupied: false, team: null, isSequence: false },
        { card: '9h', occupied: false, team: null, isSequence: false },
        { card: '10h', occupied: false, team: null, isSequence: false },
        { card: '9s', occupied: false, team: null, isSequence: false }
    ],
    [
        { card: 'w', occupied: false, team: null, isSequence: false },
        { card: '5d', occupied: false, team: null, isSequence: false },
        { card: '4d', occupied: false, team: null, isSequence: false },
        { card: '3d', occupied: false, team: null, isSequence: false },
        { card: '2d', occupied: false, team: null, isSequence: false },
        { card: 'as', occupied: false, team: null, isSequence: false },
        { card: 'ks', occupied: false, team: null, isSequence: false },
        { card: 'qs', occupied: false, team: null, isSequence: false },
        { card: '10s', occupied: false, team: null, isSequence: false },
        { card: 'w', occupied: false, team: null, isSequence: false }
    ]
];

module.exports = board;