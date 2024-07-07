from backend.db.db import DBConnector
from backend import schemas
from backend.core import utils

class CrudPopUps():
    
    async def get_all_popups(self, db: DBConnector):
        """
        Retonar os dados de todos os PopUps
        """
        query = "select * from pop_ups"
        rows = db.fetch_all(query)
        if rows:
            return rows
        return None
        
    async def get_active_popup(self, db:DBConnector):
        """
        Retorna os dados do Pop Up Ativo
        """
        query = "select * from pop_ups where popup_ativo = True"
        row = db.fetch_one(query)
        if row:
            return row
        return None
    
    async def get_popup(self, db:DBConnector, popup_name :str):
        """
        Retorna o dado do Pop Up puxando pelo Nome
        """
        query = "Select * from pop_ups where nome_popup = %(popup_name)s"
        row = db.fetch_one(query, popup_name = popup_name)
        if row:
            popup = schemas.PopUp(**row)
            return popup
        return None
    
    async def switch_active_popup(self, db:DBConnector, popup_name : str):
        """
        Mudando o estado do Pop Up Ativado <-> Desativado
        """
        query = "select * from pop_ups where nome_popup = %(popup_name)s"
        row = db.fetch_all(query, popup_name = popup_name)
        pop_up = [dict(r) for r in row]
        
        update_query = "UPDATE pop_ups set popup_ativo = %(switch)s where nome_popup = %(popup_name)s"
        ret = db.update(update_query, switch = not pop_up[0]['popup_ativo'], popup_name = popup_name)
        return ret

    async def switch_logout_popup(self, db:DBConnector, popup_name : str):
        """
        Mudando o estado do Pop Up de Logout Forçado Ativado <-> Desativado
        """
        query = "select * from pop_ups where nome_popup = %(popup_name)s"
        row = db.fetch_all(query, popup_name = popup_name)
        pop_up = [dict(r) for r in row]
        
        update_query = "UPDATE pop_ups set logout_forcado = %(switch)s where nome_popup = %(popup_name)s"
        ret = db.update(update_query, switch = not pop_up[0]['logout_forcado'], popup_name = popup_name)
        return ret

    async def update_popup(self, db:DBConnector, **changes):
        """
        Atualiza o Pop Up
        """
        changes = {k:v for k,v in changes.items() if v is not None}
        update_query = utils.UpdateQuery("pop_ups", "nome_popup", **changes)
        ret = db.update(update_query, **changes)
        return ret
    
    async def create_popup(self, db:DBConnector, **kwargs):
        """
        Cria um Novo Pop Up
        """
        popup = schemas.PopUp(**kwargs)
        insert_query = utils.InsertQuery("pop_ups", **dict(popup))
        return db.insert(insert_query, **dict(popup))
    
    async def update_popup_class(self, popup: schemas.PopUp, **kwargs):
        """  
        Atualiza os dados do Pop Up
        """
        popup.nome_popup = kwargs['nome_popup']
        popup.src_imagem = kwargs['src_imagem']
        popup.txt_titulo = kwargs['txt_titulo']
        popup.classe_titulo = kwargs['classe_titulo']
        popup.txt_conteudo = kwargs['txt_conteudo']
        popup.classe_conteudo = kwargs['classe_conteudo']
        popup.txt_botao = kwargs['txt_botao']
        popup.classe_botao = kwargs['classe_botao']
        popup.popup_ativo = kwargs['popup_ativo']
        popup.logout_forcado = kwargs['logout_forcado']
        
        return popup
    
popups = CrudPopUps()