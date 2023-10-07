"""define many-to-many relationship with Genre and User

Revision ID: d372fc15461b
Revises: d62e06e2f8f6
Create Date: 2023-10-07 01:33:15.690420

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'd372fc15461b'
down_revision = 'd62e06e2f8f6'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('user_favorite_genres',
    sa.Column('user_id', sa.Integer(), nullable=True),
    sa.Column('genre_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['genre_id'], ['genre.id'], name=op.f('fk_user_favorite_genres_genre_id_genre')),
    sa.ForeignKeyConstraint(['user_id'], ['user.id'], name=op.f('fk_user_favorite_genres_user_id_user'))
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('user_favorite_genres')
    # ### end Alembic commands ###
