import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Sunarto",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sumiran",
    image: "https://i.pravatar.cc/48?u=933382",
    balance: 20,
  },
  {
    id: 499476,
    name: "Mutingah",
    image: "https://i.pravatar.cc/48?u=499472",
    balance: 0,
  },
];

function Button({ onClick, children }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

export default function App() {
  const [friends, setFriends] = useState(initialFriends);

  const [showAddFriend, setShowAddFriend] = useState(false);
  // const [showSplit, setShowSplit] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);
  function handleShowAddFriend() {
    setShowAddFriend((cur) => !cur);
  }
  function handleSplit(value) {
    // console.log(value);
    setFriends((friends) =>
      friends.map((friend) =>
        friend.id === selectedFriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );
    setSelectedFriend(null);
  }
  function handleAddFriend(newFriend) {
    setFriends((friends) => [...friends, newFriend]);
    setShowAddFriend(false);
  }
  function handleSelection(friend) {
    setSelectedFriend((cur) => (cur?.id === friend.id ? null : friend));
    setShowAddFriend(false);
  }
  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList
          friends={friends}
          selectedFriend={selectedFriend}
          onSelection={handleSelection}
        />
        {showAddFriend && <FormAddFriend onAddFriend={handleAddFriend} />}
        <Button onClick={handleShowAddFriend}>
          {showAddFriend ? "Tutup 🤿" : "Tambah Teman"}
        </Button>
      </div>
      {selectedFriend && (
        <FormSplitBill
          selectedFriend={selectedFriend}
          onSplitBill={handleSplit}
        />
      )}
    </div>
  );
}

function FriendsList({ friends, onSelection, selectedFriend }) {
  // const friendsList = friends;
  return (
    <ul>
      {friends.map((el) => (
        <Friend
          friend={el}
          key={el.id}
          onSelection={onSelection}
          selectedFriend={selectedFriend}
        />
      ))}
    </ul>
  );
}

function Friend({ friend, onSelection, selectedFriend }) {
  const isSelected = selectedFriend?.id === friend.id;
  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>
      {friend.balance < 0 && (
        <p className="red">
          Kamu utang {friend.name} {Math.abs(friend.balance)} Ribu
        </p>
      )}
      {friend.balance > 0 && (
        <p className="green">
          {friend.name} utang kamu {Math.abs(friend.balance)} Ribu Rupiah
        </p>
      )}
      {friend.balance === 0 && <p>Kamu dan {friend.name} gak punya utang.</p>}
      <button className="button" onClick={() => onSelection(friend)}>
        {isSelected ? "Tutup" : "Pilih"}
      </button>
    </li>
  );
}

function FormAddFriend({ onAddFriend }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");
  function handleSubmit(e) {
    e.preventDefault();
    if (!name || !image) return;
    const id = crypto.randomUUID();
    const newFriend = {
      id,
      name,
      image: `${image}?=${id}`,
      balance: 0,
    };
    onAddFriend(newFriend);
    setName("");
    setImage("https://i.pravatar.cc/48");
  }
  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>🤰 Nama</label>
      <input
        type="text "
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <label>🎡 URL Foto</label>
      <input
        type="text "
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />
      <Button>Tambah</Button>
    </form>
  );
}

function FormSplitBill({ selectedFriend, onSplitBill }) {
  const [bill, setBill] = useState("");
  const [paidByUser, setPaidByUser] = useState("");
  const [whoIsPay, setWhoIsPay] = useState("user");
  const paidByFriend = bill ? bill - paidByUser : "";

  function handleSubmit(e) {
    e.preventDefault();
    if (!bill || !paidByUser) return;
    onSplitBill(whoIsPay === "user" ? paidByFriend : -paidByUser);
  }
  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>Bagi tagihan dengan {selectedFriend.name}</h2>
      <label>🗜 Biaya Tagihan</label>
      <input
        type="text "
        value={bill}
        onChange={(e) => setBill(e.target.value)}
      />
      <label>🌾 Uangmu</label>
      <input
        type="text "
        value={paidByUser}
        onChange={(e) =>
          setPaidByUser(
            Number(e.target.value) > bill ? paidByUser : Number(e.target.value)
          )
        }
      />
      <label>☃ Uang {selectedFriend.name}</label>
      <input type="text " disabled value={paidByFriend} />
      <label>🤑 Yang membayar tagihan</label>
      <select value={whoIsPay} onChange={(e) => setWhoIsPay(e.target.value)}>
        <option key="user">Kamu</option>
        <option key="friend">{selectedFriend.name}</option>
      </select>
      <Button>Bagi Tagihan</Button>
    </form>
  );
}
