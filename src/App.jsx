import React, { useState, useEffect } from 'react';
import './index.css';
import { Search,Package, Plus, Minus, Trash2,LogOut, Lock, User,  RefreshCw, Save, Bold, Italic } from 'lucide-react';
import logoImg from './you.jpg';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    type: '',idtype:'', texture: '', longueur: '', couleur: '', quantite: 0, seuil: 5
  });
  const totalMeches = stocks.reduce((acc, item) => acc + parseInt(item.quantite || 0), 0);
  const alertesStocks = stocks.filter(item => parseInt(item.quantite) <= parseInt(item.seuil)).length;
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://dyson.infinityfree.me/login.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });
      const result = await response.json();
      if (result.status === "success") {
        setIsLoggedIn(true);
        fetchStocks(); // Charger les stocks juste après le login
      } else {
        alert("Identifiants incorrects !");
      }
    } catch (err) { alert("Erreur serveur Login"); }
  };
const filteredStocks = stocks.filter(item => 
  item.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
  item.texture.toLowerCase().includes(searchTerm.toLowerCase()) ||
  item.idtype.toLowerCase().includes(searchTerm.toLowerCase())
);
  // RÉCUPÉRATION (XAMPP)
  const fetchStocks = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://dyson.infinityfree.me/getstocks.php");
      const data = await res.json();
      setStocks(Array.isArray(data) ? data : []);
    } catch (err) { console.error("Erreur XAMPP:", err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchStocks(); }, []);

  // ENREGISTREMENT
  const handleSubmit = async (e) => {
    e.preventDefault(); // EMPÊCHE LA PAGE DE DISPARAÎTRE
    try {
      const res = await fetch("http://dyson.infinityfree.me/save.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const text = await res.text(); // On lit la réponse brute
    console.log("Réponse brute du serveur :", text);
      const result = JSON.parse(text);
      if (result.status === "success") {
           alert("Enregistré avec succès !");
        setFormData({ type: '',idtype:'', texture: '', longueur: '', couleur: '', quantite: 0, seuil: 5 });
        fetchStocks(); // Actualise la liste
      }else{
        alert("Erreur retournée par le PHP : " + result.message);
      }
    } catch (err) { console.error("Détail de l'erreur :", err);
    alert("Erreur de communication avec le serveur."); }

    
};
const adjustQty = async (id, action) => {
  console.log("Tentative de modif pour ID:", id, "Action:", action);

  try {
    const response = await fetch("http://dyson.infinityfree.me/qty.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: id, action: action }),
    });

    const result = await response.json();
    console.log("Réponse du serveur:", result);

    if (result.status === "success") {
      fetchStocks(); // On recharge la liste
    } else {
      alert("Erreur serveur: " + result.message);
    }
  } catch (err) {
    console.error("Erreur de connexion XAMPP:", err);
    alert("Impossible de joindre le serveur PHP. Vérifie XAMPP !");
  }

  };
  if (!isLoggedIn) {
    return (
      <div className="login-screen">
        <form className="login-card" onSubmit={handleLogin}>
          <div style={{ background: '#db2777', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
            <Lock color="white" size={30} />
          </div>
          <h2 style={{ marginBottom: '2rem',textAlign:'center' }}>LE-<span style={{ color: '#db2777' }}>STOCKADMIN</span></h2>
          
          <div style={{ marginBottom: '1rem', textAlign: 'center' }}>
            <label style={{ fontSize: '20px', fontWeight: 800, color: 'rgba(248, 248, 12, 0.6)' }}>NOM D'ADMINISTRATEUR</label>
            <input type="text" placeholder='ADMIN ID' className="login-input-style" style={{ background: 'rgba(255,255,255,0.1)', color: 'black', border: '3px solid rgba(233, 14, 204, 0.2)' }}
              value={credentials.username} onChange={(e) => setCredentials({ ...credentials, username: e.target.value })} />
          </div>

          <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
            <label style={{ fontSize: '20px', fontWeight: 800, color: 'rgba(248, 248, 12, 0.6)' }}>MOT DE PASSE</label>
            <input type="password" placeholder="Mot de passe" 
          className="login-input-style" style={{ background: 'rgba(255,255,255,0.1)', color: 'black', border: '3px solid rgba(225, 15, 158, 0.2)' }}
              value={credentials.password} onChange={(e) => setCredentials({ ...credentials, password: e.target.value })} />
          </div>

          <button type="submit" className="btn-main">ACCÉDER AU STOCK</button>
        </form>
      </div>
    );
  }

  return (
    <div className="app-wrapper">
      
      {/* 1. LA COUCHE DU LOGO (Elle ne bouge pas) */}
      <div className="bg-overlay"></div>

      {/* 2. TON CONTENU (Tout ton code actuel va ici) */}
      <div className="container">
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          
          {/* Tes stats ou ton bouton de déconnexion */}
        </header>

        {/* Ta barre de recherche, tes stats et ta grille de stock */}
        <main>
           {/* ... Ton code de gestion de stock ... */}
        </main>
      

    </div>
    <div className="container" >
      <header style={{ padding: '2rem 1rem', maxWidth: '1400px', margin: '0 auto' }}>
        <h1 className="gold-text-gradient"style={{color: 'var(--bg-dark)', fontWeight: '900', letterSpacing: '-1px',textAlign:'center' }}>
          <Package color="#db2777" style={{ verticalAlign: 'middle', marginRight: '10px'}} /> 
          LAMADRE<span style={{ color: '#db2777' }}>STOCKS</span>
        </h1> 
        <p style={{ color: '#64748b', marginTop: '5px',textAlign:'center' }}>Gestion de stock des perruques — Lamadre empire, Douala</p>
        <p style={{ color: '#64748b', marginTop: '5px',textAlign:'center',fontStyle:Italic }}><em>¨Reservee pour la haute administration¨</em></p>
      
      </header>
      
 <div className="search-wrapper">
      <div className="search-box">
        <Search className="search-icon" size={20} />
        <input 
          type="text" 
          placeholder="Rechercher une mèche (ex: Lisse, 18 pouces, #208)..." 
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm && (
    <div className="search-results-dropdown">
      {filteredStocks.map(item => (
        <div 
        role='listbox'

          key={item.id} 
          className="search-suggestion-item"
          onClick={() => {
            scrollToItem(item.id);
            setSearchTerm(""); // On vide la recherche après le clic
          }}
        >
          <strong>{item.idtype}</strong> - {item.type} ({item.texture})
        </div>
      ))}
    </div>
  )}
      </div>

    </div>    
      <div className="dashboard">
        
   

        <aside className="glass-card">
         <button  className='btn-gold'>
              <h2 style={{ fontSize: '1.2rem',fontFamily:'cambria', marginBottom: '0.5rem',textAlign:'center',fontStyle: Bold,color: 'var(--card-bg)',fontSize: '2rem'
  }}>Nouvel Arrivage</h2></button>
          <form onSubmit={handleSubmit}>
            <div className="input-group"style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px' }}>
            <label>Modèle de mèche</label>
              <input type="text" placeholder="ex: Vietnamienne" required 
              value={formData.type}onChange={e => setFormData({...formData, type: e.target.value})} /></div>
                <div className="input-group"style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px', }}>
                <label>ID-TYPE</label>
              <input type="text" placeholder="ex: BC/MR/#..." required
              value={formData.idtype} 
              onChange={e => setFormData({...formData, idtype: e.target.value})} /></div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div className="input-group">
                <label>Texture</label>
                <input type="text" placeholder="Lisse"
                 value={formData.texture}
                  onChange={e => setFormData({...formData, texture: e.target.value})} />
              </div>
              <div className="input-group">
                <label>Longueur</label>
                <input type="number" placeholder="22\" value={formData.longueur} 
                  onChange={e => setFormData({...formData, longueur: e.target.value})} />
              </div>
            </div>
            <div className="input-group">
              <label>Couleur</label>
              <input type="text" placeholder="Brun naturel" 
              value={formData.couleur} onChange={e => setFormData({...formData, couleur: e.target.value})} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div className="input-group">
                <label>Quantité</label>
                <input type="number" value={formData.quantite} 
                  onChange={e => setFormData({...formData, quantite: e.target.value})} />
              </div>
              <div className="input-group">
                <label>Seuil Alerte</label>
                <input type="number" value={formData.seuil} 
                  onChange={e => setFormData({...formData, seuil: e.target.value})} />
              </div>
            </div>
            <button type="submit" className="btn-gold">
              <Save size={18} style={{ marginRight: '8px' }} /> ENREGISTRER EN BASE
            </button>
          </form>
        </aside>

        
        <main className="stock-display">
          {filteredStocks.length > 0 ? (
          filteredStocks.map(item => (
            <div key={item.id}
            id={`wig-${item.id}`}
            style={{ transition: 'background-color 0.5s ease' }} className="wig-card-pro">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '2px', color: '#94a3b8' }}>
              Produits en rayon ({stocks.length})
            </h3>
            <button onClick={fetchStocks} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#db2777' }}>
              <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
            </button>
          </div>

          {stocks.length === 0 ? (
            <div className="glass-card" style={{ textAlign: 'center', color: '#94a3b8' }}>Aucune mèche en stock.</div>
          ) : (
            stocks.map(item => (
              <div key={item.id} className="wig-item">
                <div>
                  <h4 style={{ margin: 0, fontSize: '1.2rem' }}>{item.type} | {item.longueur}"</h4>
                  <p style={{ margin: '5px 0 0', fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>
                    {item.texture} • {item.couleur}~{item.idtype}
                  </p>
                </div>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                 <p style={{ margin: 0, fontSize: '0.6rem', fontWeight: 800, color: '#cbd5e1' }}>UNITÉS</p>
                    <span className={`stock-count ${parseInt(item.quantite) <= parseInt(item.seuil) ? 'low-stock' : ''}`}>
                      {item.quantite}
                    </span></div>
                  <div style={{ display: 'flex', gap: '5px' }}>
<div className="flex gap-2">
  {/* Bouton pour retirer */}
  <button onClick={() => adjustQty(item.id, 'remove')} className="action-btn">
    <Minus size={16}/>
  </button>

  {/* Bouton pour ajouter */}
  <button onClick={() => adjustQty(item.id, 'add')} className="action-btn">
    <Plus size={16}/>
  </button>
   <div style={{ textAlign: 'center' }}>
                    
                  
  <button onClick={() => adjustQty(item.id, 'delete')} className="action-btn" style={{color: '#ef4444'}}><Trash2 size={16}/></button>
</div></div></div>
                
              </div>
            ))
          )}
          </div>
          ))
        ) : (
          <div className="no-result">Aucune mèche ne correspond à votre recherche.</div>
        )}
        </main>
        <div className="stats-grid">
        <div className="stat-card">
          <p style={{fontSize: '0.8rem', color: 'var(--gold)'}}>TOTAL STOCK</p>
          <h2>{totalMeches} Unités</h2>
        </div>
        <div className={`stat-card ${alertesStocks > 0 ? 'alert-border' : ''}`}>
          <p style={{fontSize: '0.8rem'}}>ALERTES RUPTURE</p>
          <h2>{alertesStocks} Modèles</h2>
        </div>
      </div>
      </div>
      
    </div></div>
  );
}
