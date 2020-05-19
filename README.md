# Consecutive
A online version of the [Sequence](https://en.wikipedia.org/wiki/Sequence_(game)) board game.

Check it out [here](https://consecutive-game.herokuapp.com/).

## Creating A Game
Choose the number of teams you wish to player (2 or 3, this may vary with the number of people playing) then choose the number of players and click Create Game.
Enter a username and share the unique URL with your friends. Once the specified number of players join, the leader can start the game.

## Rules (from [Wikipedia](https://en.wikipedia.org/wiki/Sequence_(game)#Game_rules))
* Sequence can be played with 2 to 12 players. More than 12 players cannot play. If more than three people are playing, they should divide evenly into two or three teams. With two teams, players alternate their physical positions with opponents around the playing surface. With three teams, players of a team must be positioned at every third player around the playing surface.

* If the player who played first wins and the second player wins in the next turn it’s a tie.

* The game board is placed on a flat surface (such as the floor or a table) with enough room to allow for the draw deck, a discard pile and marker chips. The jokers, if any, are removed from the deck as they are not used in the game.

* To decide who goes first, one player shuffles the card decks into two stacks. Each player takes a card from the deck. The player with the lowest card will deal, and the cards are shuffled again. Each player or team then chooses a set of poker chips; all members of each team must use the same color chips (red is only used if there are three teams).

* The number of cards dealt to each player varies by the number of people playing:

    - Two Players: Seven cards each
    - Three Players: Six cards each
    - Four Players: Six cards each
    - Six Players: Five cards each
    - Eight Players: Four cards each
    - Nine Players: Four cards each
    - Ten Players: Three cards each
    - Twelve Players: Three cards each.

* Each card is pictured twice on the game board, and Jacks (while necessary for game strategy) do not appear on the board.

* The player to the left of the dealer goes first.

* The player chooses a card from their hand, and places a chip on one of the corresponding spaces of the game board (Example: they choose Ace of Diamonds from their hand and place a chip on the Ace of Diamonds on the board). Jacks are wild. Two-Eyed Jacks can represent any card and may be used to place a chip on any space on the board. One-Eyed Jacks can remove an opponent's token from a space. Players may use the Two-Eyed Jacks to complete a row or block an opponent, and One-Eyed Jacks can remove an opponent's advantage. One-Eyed Jacks cannot be used to remove a marker chip that is already part of a completed sequence; once a sequence is achieved by a player or team, it stands. Once a Jack is played, it ends the turn.

* The played card then goes face-up into a "Discard" pile, the player then draws a replacement card from the draw deck, and play passes to the left.

* A player may place chips on either of the appropriate card spaces as long as it is not already covered by an opponent's marker chip.

* If a player possesses a card which does not have an open space on the game board, the card is considered "dead" and may be exchanged for a new card. When it is their turn, they place the dead on card on the discard pile, announce they are turning in a dead card, and take a replacement (one card per turn). Then they proceed to play their normal turn. 

## Running Locally
The game consists of a [client](https://github.com/rcyyu/consecutive-game/tree/master/client) and a [server](https://github.com/rcyyu/consecutive-game/tree/master/server).

1. Clone this repo locally.

2. Navigate to the client directory and run `npm install` then `npm start`.

3. Navigate to the server directory and run `npm install` then `npm start`.

4. Go to [localhost:3000](http://localhost:3000) to see it running.
