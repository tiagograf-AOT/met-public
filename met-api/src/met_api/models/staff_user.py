"""Staff user model class.

Manages the staff user
"""
from __future__ import annotations

from typing import Optional

from sqlalchemy import Column, ForeignKey, String, asc, desc, func
from sqlalchemy.orm import column_property
from sqlalchemy.sql import text
from sqlalchemy.sql.operators import ilike_op

from .base_model import BaseModel
from .db import db
from .pagination_options import PaginationOptions


class StaffUser(BaseModel):
    """Definition of the User entity."""

    __tablename__ = 'staff_users'

    id = Column(db.Integer, primary_key=True, autoincrement=True)
    first_name = Column(db.String(50))
    middle_name = Column(db.String(50), nullable=True)
    last_name = Column(db.String(50))
    full_name = column_property(first_name + ' ' + last_name)
    # To store the IDP user name..ie IDIR username
    username = Column('username', String(100), index=True, unique=True)
    email_address = Column(db.String(100), nullable=True)
    contact_number = Column(db.String(50), nullable=True)
    external_id = Column(db.String(50), nullable=False, unique=True)
    status_id = db.Column(db.Integer, ForeignKey('user_status.id'))
    tenant_id = db.Column(db.Integer, db.ForeignKey('tenant.id'), nullable=True)

    @classmethod
    def get_all_paginated(cls, pagination_options: PaginationOptions, search_text=''):
        """Fetch list of users by access type."""
        query = cls.query
        if pagination_options.sort_key:
            sort = asc(text(pagination_options.sort_key)) if pagination_options.sort_order == 'asc' \
                else desc(text(pagination_options.sort_key))

            query = query.order_by(sort)

        if search_text:
            query = query.filter(ilike_op(StaffUser.full_name, '%' + search_text + '%'))

        no_pagination_options = not pagination_options.page or not pagination_options.size
        if no_pagination_options:
            items = query.all()
            return items, len(items)

        page = query.paginate(page=pagination_options.page, per_page=pagination_options.size)
        return page.items, page.total

    @classmethod
    def get_user_by_external_id(cls, _external_id) -> StaffUser:
        """Get a user with the provided external id."""
        return cls.query.filter(func.lower(StaffUser.external_id) == func.lower(_external_id)).first()

    @classmethod
    def create_user(cls, user) -> StaffUser:
        """Create user."""
        user = StaffUser(
            first_name=user.get('first_name', None),
            middle_name=user.get('middle_name', None),
            last_name=user.get('last_name', None),
            email_address=user.get('email_address', None),
            contact_number=user.get('contact_number', None),
            external_id=user.get('external_id', None),
            username=user.get('username', None),
        )
        user.save()

        return user

    @classmethod
    def update_user(cls, user_id, user_dict) -> Optional[StaffUser]:
        """Update user."""
        query = StaffUser.query.filter_by(id=user_id)
        user: StaffUser = query.first()
        if not user:
            return None

        update_fields = dict(
            first_name=user_dict.get('first_name', user.first_name),
            middle_name=user_dict.get('middle_name', user.middle_name),
            last_name=user_dict.get('last_name', user.last_name),
            email_address=user_dict.get('email_address', user.email_address),
            contact_number=user_dict.get('contact_number', user.contact_number),
            external_id=user_dict.get('external_id', user.external_id),
            username=user_dict.get('username', user.username),
        )
        query.update(update_fields)
        db.session.commit()
        return user
